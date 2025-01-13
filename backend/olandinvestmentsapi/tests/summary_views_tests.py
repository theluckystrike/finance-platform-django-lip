from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from scriptupload.models import Script, Category
from olandinvestmentsapi.models import Summary, Status
from rest_framework_simplejwt.tokens import RefreshToken
from .script_views_tests import code_string_to_file
from olandinvestmentsapi.serializers import SummaryMetaSerializer


SCRIPT_CODE = """
import pandas as pd

df = pd.DataFrame({"date": ["2021-01-01", "2021-01-02", "2021-01-03"],
                     "signal_col": [0, 1, 1]})
df.to_csv("test.csv")
"""


class SummaryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.client = APIClient()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.refresh.access_token)}')

        self.category = Category.objects.create(
            name="Test Category"
        )

        self.subcategory = Category.objects.create(
            name="Test Sub Category",
            parent_category=self.category
        )
        self.subsubcategory = Category.objects.create(
            name="Test Sub Sub Category",
            parent_category=self.subcategory
        )

        self.script1 = Script.objects.create(
            name="Test Script 1",
            category=self.subsubcategory,
            file=code_string_to_file('import pandas as pd', 'test1.py'),
            description='Dummy script 1'
        )
        self.script2 = Script.objects.create(
            name="Test Script 2",
            category=self.subsubcategory,
            file=code_string_to_file('import yfinance as yf', 'test2.py'),
            description='Dummy script 2'
        )

        self.script1.run()
        self.script2.run()

        # self.summary = Summary.objects.create(
        #     name="Test Summary",
        #     scripts={
        #         self.script1.id: "signal_col",
        #         self.script2.id: "signal_col"
        #     }
        # )

        self.summary = SummaryMetaSerializer(
            data={
                "name": "Test Summary",
                "scripts": {
                    self.script1.id: "signal_col",
                    self.script2.id: "signal_col"
                }
            }
        )
        self.summary.is_valid(raise_exception=True)
        self.summary = self.summary.save()

    def test_summary_list(self):
        """Test getting list of summaries"""
        url = reverse('summaries-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_summary_detail(self):
        """Test getting single summary details"""
        url = reverse('summaries-detail', kwargs={'pk': self.summary.id},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Summary')
        self.assertEqual(response.data['scripts'][0], self.script1.id)
        self.assertEqual(response.data['scripts'][1], self.script2.id)

    def test_summary_create(self):
        """Test creating a new summary"""
        url = reverse('summaries-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            "name": "Test Create Summary",
            "scripts": {
                    self.script1.id: "signal_col",
                    self.script2.id: "signal_col"
            }
        }
        response = self.client.post(
            url, data, HTTP_HOST='api.localhost', format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Create Summary')
        # self.assertEqual(response.data['scripts'][0], self.script1.id)
        # self.assertEqual(response.data['scripts'][1], self.script2.id)
        created_obj = Summary.objects.get(name="Test Create Summary")
        self.assertEqual(
            created_obj.meta['scripts'][str(self.script1.id)]['table_col_name'], "signal_col")
        self.assertEqual(
            created_obj.meta['scripts'][str(self.script2.id)]['table_col_name'], "signal_col")

    def test_summary_update(self):
        url = reverse("summary_update", kwargs={"pk": self.summary.id},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')

        response = self.client.post(url, HTTP_HOST='api.localhost')
        self.summary.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.summary.status, Status.RUNNING)

    def test_summary_status(self):
        url = reverse("summary_status", kwargs={"pk": self.summary.id},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')

        self.summary.status = Status.RUNNING
        self.summary.save()

        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'],
                         Status.RUNNING.label)
        self.summary.status = Status.SUCCESS
        self.summary.save()

    def test_z_delete_summary(self):
        url = reverse('summaries-detail', kwargs={'pk': self.summary.id},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')

        response = self.client.delete(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Summary.DoesNotExist):
            Summary.objects.get(pk=self.summary.id)
