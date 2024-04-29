from django.db import models

# Create your models here.
class ArtUser(models.Model):
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    
    def __str__(self): 
        return self.name
    
    def authenticate(self, password):
        return self.password == password
