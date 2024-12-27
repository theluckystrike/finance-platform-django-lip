from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import json


class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='nose@django.com'
        )
        self.client = APIClient()
        self.refresh = RefreshToken.for_user(self.user)
        self.refresh_token = str(self.refresh)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {str(self.refresh.access_token)}')

    def test_01_login(self):
        """Test user login"""
        url = reverse('token_obtain_pair', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, json.dumps(
            data), content_type='application/json', HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

    def test_02_refresh_token(self):
        """Test refreshing token"""
        url = reverse('token_refresh', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'refresh': self.refresh_token
        }
        response = self.client.post(
            url, data, HTTP_HOST='api.localhost', format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

    def test_03_user_info(self):
        """Test getting user info"""
        url = reverse('user_detail', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)

    def test_04_logout(self):
        """Test user logout"""
        url = reverse('token_logout', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'refresh': self.refresh_token
        }
        response = self.client.post(
            url, data, HTTP_HOST='api.localhost', format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

        url = reverse('token_refresh',
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'refresh': self.refresh_token
        }
        response = self.client.post(
            url, data, HTTP_HOST='api.localhost', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
