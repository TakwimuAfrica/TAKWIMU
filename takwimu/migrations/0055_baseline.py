# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-04-29 08:47
from django.db import migrations, models
import django.db.models.deletion
import wagtail.core.blocks
import wagtail.core.fields


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailimages', '0021_image_file_hash'),
        ('takwimu', '0054_faqsetting_overview'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='faqsetting',
            options={'verbose_name': 'FAQs'},
        ),
        migrations.RemoveField(
            model_name='aboutpage',
            name='content',
        ),
        migrations.RemoveField(
            model_name='faqsetting',
            name='overview',
        ),
        migrations.RemoveField(
            model_name='indexpage',
            name='latest_news_stories_description',
        ),
        migrations.RemoveField(
            model_name='indexpage',
            name='making_description',
        ),
        migrations.RemoveField(
            model_name='indexpage',
            name='tagline_description',
        ),
        migrations.RemoveField(
            model_name='indexpage',
            name='what_you_can_do_download',
        ),
        migrations.RemoveField(
            model_name='indexpage',
            name='what_you_can_do_present',
        ),
        migrations.RemoveField(
            model_name='indexpage',
            name='what_you_can_do_research',
        ),
        migrations.RemoveField(
            model_name='supportservicessetting',
            name='overview',
        ),
        migrations.AddField(
            model_name='aboutpage',
            name='about_takwimu',
            field=wagtail.core.fields.StreamField([('about_takwimu_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='About Takwimu', max_length=1024)), ('description', wagtail.core.blocks.RichTextBlock(default='<p>People need accurate, objective information to make good decisions. However, uneven access to quality information weakens the impact of policy and programming in Africa as well as the ability of local development actors, particularly those with limited resources, to drive necessary change.</p><br/><p>Takwimu was launched in 2018 to empower African changemakers with the best data available and support their efforts to put this into effective use. We take a holistic view of what kinds of data are needed to drive change.</p><br/><p>Takwimu provides access to a growing body of national and sub-national statistics in the health, agriculture, education and financial inclusion sectors - combined with expert analysis of the key stakeholders, decision processes, policies, organisations and budgets that are driving development outcomes. All Takwimu content is visualised and packaged to be easily understood and freely shared.</p><br/><p>Takwimu currently covers 10 countries: Burkina Faso, Democratic Republic of Congo, Ethiopia, Kenya, Nigeria, Senegal, South Africa, Tanzania, Uganda and Zambia, in English and French. We&rsquo;re working to add more countries and additional languages. Takwimu is supported by the Bill &amp; Melinda Gates Foundation</p>', required=False))]))], blank=True),
        ),
        migrations.AddField(
            model_name='aboutpage',
            name='promotion_image',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.Image'),
        ),
        migrations.AddField(
            model_name='aboutpage',
            name='tweet_creator',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='aboutpage',
            name='twitter_card',
            field=models.CharField(blank=True, choices=[('summary', 'Summary'), ('summary_large_image', 'Summary with image'), (
                'player', 'Media player'), ('app', 'Link to download app')], max_length=255),
        ),
        migrations.AddField(
            model_name='faqsetting',
            name='description',
            field=wagtail.core.fields.RichTextField(
                default='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et lorem eros. Integer vel venenatis urna. Nam vestibulum felis vitae scelerisque imperdiet. Nulla nisl libero, vestibulum eu lorem at, consequat finibus libero. Ut tincidunt rutrum purus vitae interdum. Phasellus efficitur tincidunt lorem ut blandit.'),
        ),
        migrations.AddField(
            model_name='faqsetting',
            name='label',
            field=models.CharField(
                default='FAQs', help_text='Short title used in navigation, etc.', max_length=255),
        ),
        migrations.AddField(
            model_name='faqsetting',
            name='title',
            field=models.CharField(
                default='Frequently Asked Questions', max_length=1024),
        ),
        migrations.AddField(
            model_name='indexpage',
            name='latest_news_stories',
            field=wagtail.core.fields.StreamField([('latest_news_stories_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Latest News & Stories', max_length=1024)), (
                'description', wagtail.core.blocks.RichTextBlock(default='<p>Lorem ipsum dolor sit amet, adipiscing elitauris con lorem ipsum dolor sit amet.</p>', required=False))]))], blank=True),
        ),
        migrations.AddField(
            model_name='indexpage',
            name='making_of_takwimu',
            field=wagtail.core.fields.StreamField([('making_of_takwimu_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Making of Takwimu', max_length=1024)), ('description', wagtail.core.blocks.RichTextBlock(
                default='<p>Lorem ipsum dolor sit amet, adipiscing elitauris con lorem ipsum dolor sit amet.</p>', required=False)), ('link', wagtail.core.blocks.URLBlock(default='https://www.youtube-nocookie.com/embed/DvDCCETHsTo'))]))], blank=True),
        ),
        migrations.AddField(
            model_name='indexpage',
            name='tagline',
            field=wagtail.core.fields.RichTextField(
                default='<p>Lorem ipsum dolor sit amet, adipiscing elitauris con <a href="/about">find out more about us</a></p>', verbose_name='Description'),
        ),
        migrations.AddField(
            model_name='indexpage',
            name='what_you_can_do_with_takwimu',
            field=wagtail.core.fields.StreamField([('what_you_can_do_with_takwimu_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='What You Can Do With Takwimu', max_length=1024)), ('uses_of_takwimu', wagtail.core.blocks.StreamBlock(
                [('use_of_takwimu', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(max_length=1024)), ('description', wagtail.core.blocks.TextBlock(default='Lorem ipsum dolor sit amet, adipiscing elitauris con lorem ipsum dolor sit amet.', required=False))]))], max_num=3))]))], blank=True),
        ),
        migrations.AddField(
            model_name='supportservicessetting',
            name='description',
            field=wagtail.core.fields.RichTextField(
                default='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et lorem eros. Integer vel venenatis urna. Nam vestibulum felis vitae scelerisque imperdiet. Nulla nisl libero, vestibulum eu lorem at, consequat finibus libero. Ut tincidunt rutrum purus vitae interdum. Phasellus efficitur tincidunt lorem ut blandit.'),
        ),
        migrations.AddField(
            model_name='supportservicessetting',
            name='label',
            field=models.CharField(
                default='Services', help_text='Short title used in navigation, etc.', max_length=255),
        ),
        migrations.AddField(
            model_name='supportservicessetting',
            name='title',
            field=models.CharField(default='Services', max_length=1024),
        ),
        migrations.AlterField(
            model_name='aboutpage',
            name='methodology',
            field=wagtail.core.fields.StreamField([('methodology_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Methodology', max_length=1024)), ('description', wagtail.core.blocks.RichTextBlock(
                default='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et lorem eros. Integer vel venenatis urna. Nam vestibulum felis vitae scelerisque imperdiet. Nulla nisl libero, vestibulum eu lorem at, consequat finibus libero. Ut tincidunt rutrum purus vitae interdum. Phasellus efficitur tincidunt lorem ut blandit.', required=False))]))], blank=True),
        ),
        migrations.AlterField(
            model_name='aboutpage',
            name='related_content',
            field=wagtail.core.fields.StreamField([('related_content_links', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Related Content', max_length=1024)), ('related_links', wagtail.core.blocks.StreamBlock([('related_link', wagtail.core.blocks.StructBlock([('link', wagtail.core.blocks.StreamBlock(
                [('url', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.TextBlock()), ('link', wagtail.core.blocks.URLBlock())], icon='link')), ('page', wagtail.core.blocks.PageChooserBlock(required=False))], block_counts={'page': {'max_num': 1}, 'url': {'max_num': 1}}, max_num=1, min_num=1))]))], max_num=10))]))], blank=True),
        ),
        migrations.AlterField(
            model_name='faqsetting',
            name='faqs',
            field=wagtail.core.fields.StreamField([('faq', wagtail.core.blocks.StructBlock([('question', wagtail.core.blocks.CharBlock(required=True)), ('answer', wagtail.core.blocks.RichTextBlock(required=True)), ('cta_one_url', wagtail.core.blocks.URLBlock(
                default='https://takwimu.zendesk.com/', label="'Find Out More' Button URL")), ('cta_two_name', wagtail.core.blocks.CharBlock(label='Second Button Name (Optional)', required=False)), ('cta_two_url', wagtail.core.blocks.URLBlock(label='Second Button URL (Optional)', required=False))]))], blank=True, verbose_name='Questions & Answers'),
        ),
        migrations.AlterField(
            model_name='indexpage',
            name='featured_analysis',
            field=wagtail.core.fields.StreamField([('featured_analysis_content', wagtail.core.blocks.StructBlock([('featured_page', wagtail.core.blocks.PageChooserBlock(target_model=['takwimu.ProfileSectionPage'])), ('from_country', wagtail.core.blocks.ChoiceBlock(choices=[(
                'BF', 'Burkina Faso'), ('CD', 'Democratic Republic of Congo'), ('ET', 'Ethiopia'), ('KE', 'Kenya'), ('NG', 'Nigeria'), ('SN', 'Senegal'), ('ZA', 'South Africa'), ('TZ', 'Tanzania'), ('UG', 'Uganda'), ('ZM', 'Zambia')], help_text='This is for labelling only.'))]))], blank=True),
        ),
        migrations.AlterField(
            model_name='indexpage',
            name='featured_data',
            field=wagtail.core.fields.StreamField([('featured_data_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(required=False)), ('country', wagtail.core.blocks.ChoiceBlock(choices=[('ET', 'Ethiopia'), ('KE', 'Kenya'), ('NG', 'Nigeria'), ('SN', 'Senegal'), ('TZ', 'Tanzania')], label='Country')), ('data_id', wagtail.core.blocks.ChoiceBlock(choices=[('demographics-residence_dist', 'Population by Residence'), ('demographics-sex_dist', 'Population by Sex'), ('crops-crop_distribution', 'Crops Produced'), ('health_centers-prevention_methods_dist', 'Knowledge of HIV Prevention Methods'), ('education-education_reached_distribution', 'Highest Level of Education Attained'), ('education-school_attendance_distribution', 'School Attendance by Sex'), ('donors-donor_assistance_dist', 'Principal Donors'), ('poverty-poverty_residence_dist', 'Percentage of Population living in Poverty by Residence'), ('poverty-poverty_age_dist', 'Percentage of Population living in Poverty by Age and Residence'), ('fgm-fgm_age_dist', 'Percentage of Women that have undergone FGM by Age'), ('security-seized_firearms_dist', 'Seized Firearms'), ('donors-donor_programmes_dist', 'Donor Funded Programmes'), ('budget-government_expenditure_dist', 'Government Expenditure'), ('health_centers-health_centers_dist', 'Number of health centers by type'), ('worldbank-cereal_yield_kg_per_hectare', 'Cereal Yield in Kg Per Hectare'), ('worldbank-agricultural_land', 'Agricultural land (% of land area)'), ('worldbank-gini_index', 'GINI Index'), ('worldbank-access_to_basic_services', 'People using at least basic drinking water services (% of population)'), ('worldbank-primary_school_enrollment', 'School enrollment, primary, male (% gross)'), ('worldbank-account_ownership', 'Account ownership at a financial institution or with a mobile-money-service provider, (% of population ages 15+)'), ('worldbank-youth_unemployment', 'Unemployment, youth (% of labor force ages 15-24) (modeled ILO estimate)'), ('worldbank-adult_literacy_rate', 'Literacy rate, adult (% of population ages 15 and above)'),
                                                                                                                                                                                                                                                                                                                                                                                                     ('worldbank-foreign_direct_investment_net_inflows', 'Foreign direct investment, net inflows (% of GDP)'), ('worldbank-maternal_mortality', 'Maternal mortality ratio (modeled estimate, per 100,000 live births)'), ('worldbank-hiv_prevalence', 'Prevalence of HIV, (% ages 15-24)'), ('worldbank-employment_to_population_ratio', 'Employment to population ratio, 15+, (%) (modeled ILO estimate)'), ('worldbank-gdp_per_capita', 'GDP per capita (current US$)'), ('worldbank-primary_education_completion_rate', 'Primary completion rate,(% of relevant age group)'), ('worldbank-secondary_school_enrollment', 'School enrollment, secondary (% gross)'), ('worldbank-nurses_and_midwives', 'Nurses and midwives (per 1,000 people)'), ('worldbank-mobile_phone_subscriptions', 'Mobile Phone Subscriptions(per 100 people)'), ('worldbank-gdp_per_capita_growth', 'GDP per capita growth (annual %)'), ('worldbank-prevalence_of_undernourishment', 'Prevalence of undernourishment (% of population)'), ('worldbank-life_expectancy_at_birth', 'Life Expectancy At Birth (Years)'), ('worldbank-tax_as_percentage_of_gdp', 'Tax As Percentage Of GDP'), ('worldbank-births_attended_by_skilled_health_staff', 'Births Attended By Skilled Health Staff (% of total)'), ('worldbank-incidence_of_malaria_per_1000_pop_at_risk', 'Incidence Of Malaria Per 1000 Population At Risk'), ('worldbank-tax_revenue', 'Tax revenue (current LCU)'), ('worldbank-gdp', 'GDP'), ('worldbank-gdp_growth', 'GDP Growth')], label='Data')), ('chart_type', wagtail.core.blocks.ChoiceBlock(choices=[('histogram', 'Histogram'), ('pie', 'Pie Chart'), ('grouped_column', 'Grouped Column')], label='Chart Type')), ('data_stat_type', wagtail.core.blocks.ChoiceBlock(choices=[('percentage', 'Percentage'), ('scaled-percentage', 'Scaled Percentage'), ('dollar', 'Dollar')], label='Stat Type')), ('chart_height', wagtail.core.blocks.IntegerBlock(help_text='Default is 300px', label='Chart Height', required=False)), ('description', wagtail.core.blocks.TextBlock(label='Description of the data', required=False))]))], blank=True),
        ),
        migrations.AlterField(
            model_name='profilepage',
            name='related_content',
            field=wagtail.core.fields.StreamField([('related_content_links', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Related Content', max_length=1024)), ('related_links', wagtail.core.blocks.StreamBlock([('related_link', wagtail.core.blocks.StructBlock([('link', wagtail.core.blocks.StreamBlock(
                [('url', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.TextBlock()), ('link', wagtail.core.blocks.URLBlock())], icon='link')), ('page', wagtail.core.blocks.PageChooserBlock(required=False))], block_counts={'page': {'max_num': 1}, 'url': {'max_num': 1}}, max_num=1, min_num=1))]))], max_num=10))]))], blank=True),
        ),
        migrations.AlterField(
            model_name='profilesectionpage',
            name='description',
            field=wagtail.core.fields.RichTextField(blank=True),
        ),
        migrations.AlterField(
            model_name='profilesectionpage',
            name='related_content',
            field=wagtail.core.fields.StreamField([('related_content_links', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Related Content', max_length=1024)), ('related_links', wagtail.core.blocks.StreamBlock([('related_link', wagtail.core.blocks.StructBlock([('link', wagtail.core.blocks.StreamBlock(
                [('url', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.TextBlock()), ('link', wagtail.core.blocks.URLBlock())], icon='link')), ('page', wagtail.core.blocks.PageChooserBlock(required=False))], block_counts={'page': {'max_num': 1}, 'url': {'max_num': 1}}, max_num=1, min_num=1))]))], max_num=10))]))], blank=True),
        ),
    ]