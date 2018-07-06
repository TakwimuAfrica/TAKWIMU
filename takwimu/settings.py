# coding=utf-8
import os

from hurumap.settings import *  # noqa

from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# insert our overrides before both census and hurumap
INSTALLED_APPS = ['wagtail.contrib.modeladmin',
    'wagtail_modeltranslation', 'wagtail_modeltranslation.makemigrations',
    'wagtail_modeltranslation.migrate','takwimu', 'fontawesome'] + INSTALLED_APPS + ['debug_toolbar']

ROOT_URLCONF = 'takwimu.urls'

MIDDLEWARE_CLASSES = MIDDLEWARE_CLASSES + (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.middleware.locale.LocaleMiddleware'
)

INTERNAL_IPS = ['127.0.0.1', '172.18.0.1']

TEMPLATE_CONTEXT_PROCESSORS = TEMPLATE_CONTEXT_PROCESSORS + (
    'takwimu.context_processors.takwimu_stories',
)


# -------------------------------------------------------------------------------------
# Website Details
# -------------------------------------------------------------------------------------

HURUMAP['name'] = 'TAKWIMU'
HURUMAP['url'] = os.environ.get('HURUMAP_URL','https://takwimu.africa/')

hurumap_profile = 'census'

HURUMAP['profile_builder'] = 'takwimu.profiles.{}.get_profile'.format(hurumap_profile)
HURUMAP['default_geo_version'] = os.environ.get('DEFAULT_GEO_VERSION', '2009')
HURUMAP['legacy_embed_geo_version'] = '2009'


HURUMAP['levels'] = {
    'continent': {
        'plural': 'continents',
        'children': ['country'],
    },
    'country': {
        'plural': 'countries',
    }
}
HURUMAP['comparative_levels'] = ['country']
HURUMAP['geometry_data'] = {
    '2009': {
        'continent': 'geo/continent.topojson',
        'country': 'geo/country.topojson'
    }
}

# Map config
HURUMAP['map_centre'] = None
HURUMAP['map_zoom'] = None

# -------------------------------------------------------------------------------------
# Google Analytics

HURUMAP['ga_tracking_ids'] = [
    'UA-44795600-8',  # HURUmap
    'UA-115543098-1'  # TAKWIMU
]

# Making sure they are the same
WAZIMAP = HURUMAP


# -------------------------------------------------------------------------------------
# Database Configs
# -------------------------------------------------------------------------------------

DATABASE_URL = os.environ.get('DATABASE_URL',
                              'postgresql://takwimu:takwimu@localhost/takwimu')
DATABASES['default'] = dj_database_url.parse(DATABASE_URL)


# -------------------------------------------------------------------------------------
# Logging Configs
# -------------------------------------------------------------------------------------

LOGGING['loggers']['takwimu'] = {'level': 'DEBUG' if DEBUG else 'INFO'}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# -------------------------------------------------------------------------------------
# Wagtail Modeltranslation Configs
# -------------------------------------------------------------------------------------

USE_I18N = True

LANGUAGES = (
    ('en', _('English')),
    ('fr', _('French')),
    ('sw', _('Swahili')),
    ('am', _('Amharic')),
)

MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'

MODELTRANSLATION_FALLBACK_LANGUAGES = {'default': ('en',)}

