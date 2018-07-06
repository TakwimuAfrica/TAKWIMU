from .models import TopicPage, ProfileSectionPage
from modeltranslation.translator import TranslationOptions
from modeltranslation.decorators import register

@register(TopicPage)
class TopicPageTR(TranslationOptions):
    fields = (
        'description',
    )

@register(ProfileSectionPage)
class ProfileSectionPageTR(TranslationOptions):
    fields = (
        'description',
    )