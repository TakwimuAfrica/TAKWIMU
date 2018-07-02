from wagtail.contrib.modeladmin.options import modeladmin_register, ModelAdminGroup, ModelAdmin
from hurumap.models import DataIndicator, DataIndicatorPublisher


class DataPublisherAdmin(ModelAdmin):
    model = DataIndicatorPublisher
    menu_label = 'Publishers'
    menu_icon = 'group'
    list_display = ('name', 'url')
    search_fields = ('name')

class DataIndicatorAdmin(ModelAdmin):
    model = DataIndicator
    menu_label = 'Indicators'
    menu_icon = 'table'
    list_display = ('title', 'description')
    search_fields = ('title', 'description')
    form_fields_exclude = ('view', 'process_prefs', 'data_values', 'publisher_data')


class DataAdminGroup(ModelAdminGroup):
    menu_label = 'Data'
    menu_icon = 'folder-open-inverse'
    menu_order = 200
    items = (DataPublisherAdmin, DataIndicatorAdmin)


modeladmin_register(DataAdminGroup)
