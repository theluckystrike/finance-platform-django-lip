from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from scriptupload.models import Category, Script, Report
from rest_framework_simplejwt.tokens import RefreshToken
from .script_views_tests import code_string_to_file
import json


class ReportTests(APITestCase):
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
        self.subsubcategory1 = Category.objects.create(
            name="Test Sub Sub Category 1",
            parent_category=self.subcategory
        )
        self.subsubcategory2 = Category.objects.create(
            name="Test Sub Sub Category 2",
            parent_category=self.subcategory
        )

        self.script1 = Script.objects.create(
            name="Test Script 1",
            category=self.subsubcategory1,
            file=code_string_to_file('import pandas as pd', 'test.py'),
            description='Dummy script 1'
        )
        self.script2 = Script.objects.create(
            name="Test Script 2",
            category=self.subsubcategory1,
            file=code_string_to_file('import pandas as pd', 'test.py'),
            description='Dummy script 2'
        )

        self.report1 = Report.objects.create(
            name="Test Report 1"
        )
        self.report2 = Report.objects.create(
            name="Test Report 2"
        )
        self.report1.scripts.set([self.script1])
        self.report2.scripts.set([self.script2])

    def test_report_list(self):
        """Test getting list of reports"""
        url = reverse('reports-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_report_detail(self):
        """Test getting single report details"""
        url = reverse('reports-detail', kwargs={'pk': self.report1.pk},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.report1.name)
        self.assertEqual(response.data['scripts'][0], self.script1.id)

    def test_report_create(self):
        """Test creating a new report"""
        url = reverse('reports-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'name': 'New Report',
            'scripts': [self.script1.id, self.script2.id]
        }
        response = self.client.post(url, data, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Report')
        self.assertEqual(response.data['scripts'][0], self.script1.id)
        self.assertEqual(response.data['scripts'][1], self.script2.id)
        Report.objects.get(name='New Report').delete()

    def test_update_report(self):
        """Test updating a report"""
        url = reverse('reports-detail', kwargs={'pk': self.report1.pk},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        data = {
            'name': 'Updated Report',
            'scripts': [self.script1.id]
        }
        response = self.client.put(url, data, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Report')
        self.assertEqual(response.data['scripts'][0], self.script1.id)
        self.assertEqual(len(response.data['scripts']), 1)

    def test_get_report_status(self):
        """Test getting the status of a report"""
        url = reverse('report_status', kwargs={'pk': self.report1.pk},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

    def test_merge_reports(self):
        """Test merging two reports"""
        url = reverse('reports_merge', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'reports': [self.report1.id, self.report2.id],
            'name': 'Merged Report'
        }
        response = self.client.post(url, json.dumps(data), HTTP_HOST='api.localhost', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn(self.script1, Report.objects.get(name='Merged Report').scripts.all())
        self.assertIn(self.script2, Report.objects.get(name='Merged Report').scripts.all())

    def test_report_run(self):
        """Test running a report"""
        url = reverse('report_update', kwargs={'pk': self.report1.pk},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        response = self.client.post(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.report1.refresh_from_db()
        self.assertEqual(self.report1.status, 'running')
