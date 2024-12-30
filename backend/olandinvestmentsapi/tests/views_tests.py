from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from scriptupload.models import Category, Script, Report
from rest_framework_simplejwt.tokens import RefreshToken


class SearchTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.refresh = RefreshToken.for_user(self.user)
        self.client = APIClient()
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.refresh.access_token)}')

        self.categoryA = Category.objects.create(
            name="A Category"
        )
        self.scriptA = Script.objects.create(
            name="A Script",
        )
        self.reportA = Report.objects.create(
            name="A Report",
        )
        self.scriptVerbose = Script.objects.create(
            name="MatchMe"
        )

    def test_search(self):
        url = reverse('search', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = "query=A"
        response = self.client.get(
            url, HTTP_HOST="api.localhost", QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scripts'][0]['id'], self.scriptA.id)
        self.assertEqual(response.data['reports'][0]['id'], self.reportA.id)
        self.assertEqual(response.data['categories']
                         [0]['id'], self.categoryA.id)

    def test_search_verbose(self):
        url = reverse('search', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = f"query={self.scriptVerbose.name}"
        response = self.client.get(
            url, HTTP_HOST="api.localhost", QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scripts']
                         [0]['id'], self.scriptVerbose.id)

    def test_search_empty_query(self):
        url = reverse('search', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(
            url, HTTP_HOST="api.localhost", QUERY_STRING="")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
