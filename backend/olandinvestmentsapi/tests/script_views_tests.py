from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from scriptupload.models import Script, Category
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files import File
from io import BytesIO


def code_string_to_file(code: str, filename: str):
    return File(BytesIO(code.encode('utf-8')), name=filename)


class ScriptTests(APITestCase):
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
        self.category2 = Category.objects.create(
            name="Test Category 2"
        )

        self.subcategory = Category.objects.create(
            name="Test Sub Category",
            parent_category=self.category
        )
        self.subcategory2 = Category.objects.create(
            name="Test Sub Category 2",
            parent_category=self.category
        )
        self.subsubcategory = Category.objects.create(
            name="Test Sub Sub Category",
            parent_category=self.subcategory
        )
        self.subsubcategory2 = Category.objects.create(
            name="Test Sub Sub Category 2",
            parent_category=self.subcategory
        )
        self.script = Script.objects.create(
            name="Test Script",
            category=self.subsubcategory,
            file=code_string_to_file('import pandas as pd', 'test.py'),
            description='Dummy script'
        )
        self.script2 = Script.objects.create(
            name="Test Script 2",
            category=self.category2,
            file=code_string_to_file('import pandas as pd', 'test.py'),
            description='Dummy script 2'
        )

    def test_script_list(self):
        """Test getting list of scripts"""
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_script_detail(self):
        """Test getting single script details"""
        url = reverse('scripts-detail', kwargs={'pk': self.script.pk},
                      current_app='olandinvestmentsapi', urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Script')
        self.assertEqual(response.data['description'], 'Dummy script')
        self.assertEqual(response.data['category']
                         ['id'], self.subsubcategory.id)

    def test_script_create(self):
        """Test creating a new script"""
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        python_code = 'import numpy as np'
        python_file = code_string_to_file(python_code, 'test.py')
        description = 'A dummy script'
        data = {
            'name': 'New Script',
            'category': self.subsubcategory.id,
            'file': python_file,
            'description': description
        }
        response = self.client.post(url, data, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Script')
        self.assertEqual(response.data['description'], description)
        self.assertEqual(response.data['category'], self.subsubcategory.id)
        created_obj = Script.objects.get(name="New Script")
        self.assertEqual(created_obj.file.read().decode('utf-8'), python_code)

    def test_update_script(self):
        """Test updating a script with PATCH"""
        url = reverse('scripts-detail',
                      kwargs={'pk': self.script.pk},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        python_code = '# no code to see here'
        data = {
            'name': 'Updated Script',
            'description': 'Updated description',
            'file': code_string_to_file(python_code, 'test.py'),
            'category': self.subcategory.id
        }
        response = self.client.patch(url, data, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Script')
        self.assertEqual(response.data['description'], 'Updated description')
        self.assertEqual(response.data['category'], self.subcategory.id)
        self.script.refresh_from_db()
        self.assertEqual(self.script.name, 'Updated Script')
        self.assertEqual(self.script.description, 'Updated description')
        self.assertEqual(self.script.category.id, self.subcategory.id)
        self.assertEqual(self.script.file.read().decode('utf-8'), python_code)

    # _z_ so that it runs last
    def test_z_delete_script(self):
        """Test deleting a script"""
        url = reverse('scripts-detail',
                      kwargs={'pk': self.script.pk},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.delete(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Script.DoesNotExist):
            Script.objects.get(pk=self.script.pk)

    def test_script_status(self):
        """Test getting script execution status"""
        url = reverse('script_status',
                      kwargs={'pk': self.script.pk},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        # Set initial status
        self.script.status = Script.ExecutionStatus.FAILURE
        self.script.save()

        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'],
                         Script.ExecutionStatus.FAILURE.label)
        self.assertIn('error_message', response.data)
        self.script.status = Script.ExecutionStatus.SUCCESS
        self.script.save()
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'],
                         Script.ExecutionStatus.SUCCESS.label)

    def test_script_status_does_not_exist(self):
        url = reverse('script_status',
                      kwargs={'pk': 123456789},
                      current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')

        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_run_script(self):
        url = reverse('script_run', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls', kwargs={'pk': self.script.pk})

        response = self.client.post(url, HTTP_HOST='api.localhost')
        self.script.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.script.status, Script.ExecutionStatus.RUNNING)

    def test_run_script_does_not_exist(self):
        url = reverse('script_run', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls', kwargs={'pk': 123456789})

        response = self.client.post(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_script_list_filter_category(self):
        """Test getting list of scripts with category filter"""
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = f"category={self.category.id}"
        response = self.client.get(
            url, HTTP_HOST='api.localhost', QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.script.id)

    def test_script_list_filter_subcategory(self):
        """Test getting list of scripts with subcategory filter"""
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = f"category={self.category.id}&subcategory1={self.subcategory.id}"
        response = self.client.get(
            url, HTTP_HOST='api.localhost', QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.script.id)

    def test_script_list_filter_subsubcategory(self):
        """Test getting list of scripts with subsubcategory filter"""
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = f"category={self.category.id}&subcategory1={self.subcategory.id}&subcategory2={self.subsubcategory.id}"
        response = self.client.get(
            url, HTTP_HOST='api.localhost', QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.script.id)

        query = f"category={self.category.id}&subcategory1={self.subcategory.id}&subcategory2={self.subsubcategory2.id}"
        response = self.client.get(
            url, HTTP_HOST='api.localhost', QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_script_list_filter_status(self):
        """Test getting list of scripts with status filter"""
        self.script2.status = Script.ExecutionStatus.FAILURE
        self.script2.save()
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        query = f"status=failure"
        response = self.client.get(
            url, HTTP_HOST='api.localhost', QUERY_STRING=query)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.script2.id)
