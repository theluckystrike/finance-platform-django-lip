from django.db import models


class Category(models.Model):
    """
    Config for the category of a new script.

    The result of this is used to set the script category in the database.
    """
    name = models.CharField(max_length=100, unique=True)
    parent_category = models.ForeignKey(
        'self', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.name

    def get_children(self):
        return Category.objects.filter(parent_category=self)

    def get_level(self):
        if not self.parent_category:
            return 0
        elif not self.parent_category.parent_category:
            return 1
        else:
            return 2

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
