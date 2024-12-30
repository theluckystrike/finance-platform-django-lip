from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from scriptupload.models import Category
from rest_framework_simplejwt.tokens import RefreshToken


class CategoryTests(APITestCase):
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

    def test_category_list(self):
        url = reverse('categories-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_category_list_filter_parent_category(self):
        url = reverse('categories-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = f"parent_category={self.category.id}"
        response = self.client.get(
            url, HTTP_HOST='api.localhost', QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results']
                         [0]['id'], self.subcategory.id)

    def test_category_detail(self):
        url = reverse('categories-detail', kwargs={'pk': self.category.pk},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Category')
        self.assertEqual(response.data['parent_category'], None)

    def test_category_create(self):
        url = reverse('categories-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'name': 'New Category',
            'parent_category': self.category.id
        }
        response = self.client.post(url, data, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Category')
        self.assertEqual(response.data['parent_category'], self.category.id)

    def test_update_category(self):
        url = reverse('categories-detail',
                      kwargs={'pk': self.category.pk},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        data = {
            'name': 'Updated Category',
        }
        response = self.client.patch(url, data, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Category')
        self.category.refresh_from_db()
        self.assertEqual(self.category.name, 'Updated Category')

    def test_z_delete_category(self):
        url = reverse('categories-detail',
                      kwargs={'pk': self.category.pk},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.delete(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Category.DoesNotExist):
            Category.objects.get(pk=self.category.pk)
