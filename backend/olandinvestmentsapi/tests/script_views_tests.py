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

        self.subcategory = Category.objects.create(
            name="Test Sub Category",
            parent_category=self.category
        )
        self.subsubcategory = Category.objects.create(
            name="Test Sub Sub Category",
            parent_category=self.subcategory
        )

        self.script = Script.objects.create(
            name="Test Script",
            category=self.subsubcategory,
            file=code_string_to_file('import pandas as pd', 'test.py'),
            description='Dummy script'
        )

    def test_script_list(self):
        """Test getting list of scripts"""
        url = reverse('scripts-list', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls')
        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

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
        self.script.status = Script.ExecutionStatus.RUNNING
        self.script.save()

        response = self.client.get(url, HTTP_HOST='api.localhost')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'],
                         Script.ExecutionStatus.RUNNING.label)
        self.script.status = Script.ExecutionStatus.SUCCESS
        self.script.save()

    def test_run_script(self):
        url = reverse('script_run', current_app='olandinvestmentsapi',
                      urlconf='olandinvestmentsapi.urls', kwargs={'pk': self.script.pk})

        response = self.client.post(url, HTTP_HOST='api.localhost')
        self.script.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.script.status, Script.ExecutionStatus.RUNNING)
