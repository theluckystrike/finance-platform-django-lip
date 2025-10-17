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
        url = '/api/auth/login'
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, json.dumps(
            data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

    def test_02_refresh_token(self):
        """Test refreshing token"""
        url = '/api/auth/refresh-token'
        data = {
            'refresh': self.refresh_token
        }
        response = self.client.post(url, data, format='json')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

    def test_03_user_info(self):
        """Test getting user info"""
        url = '/api/auth/user-info'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)

    def test_04_logout(self):
        """Test user logout"""
        url = '/api/auth/logout'
        data = {
            'refresh': self.refresh_token
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

        url = '/api/auth/refresh-token'
        data = {
            'refresh': self.refresh_token
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
