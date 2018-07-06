from django.core.urlresolvers import resolve
from django.test import TestCase

from django.utils import translation

class AuthenticationTest(TestCase):
    # Getting the curreng language
    language_code = translation.get_language()

    def test_login_endpoint_exists(self):
        found = resolve('/' + self.language_code + '/accounts/login/')
        self.assertEqual(found.view_name, 'account_login')

    def test_signup_endpoint_exists(self):
        found = resolve('/' + self.language_code + '/accounts/signup/')
        self.assertEqual(found.view_name, 'account_signup')
