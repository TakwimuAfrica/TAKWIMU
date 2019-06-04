# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-28 12:51
from __future__ import unicode_literals

from django.db import migrations
import takwimu.models.data
import wagtail.core.blocks
import wagtail.core.fields
import wagtail.documents.blocks
import wagtail.snippets.blocks


class Migration(migrations.Migration):

    dependencies = [
        ('takwimu', '0068_legalpage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indexpage',
            name='featured_data',
            field=wagtail.core.fields.StreamField([('featured_data_content', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='Featured Data', max_length=1024)), ('featured_data', wagtail.core.blocks.StreamBlock([('indicator', wagtail.core.blocks.StructBlock([('widget', wagtail.core.blocks.StreamBlock([('hurumap_snippet', wagtail.snippets.blocks.SnippetChooserBlock(takwimu.models.data.ProfileData)), ('flourish', wagtail.core.blocks.StructBlock([('label', wagtail.core.blocks.CharBlock(help_text="This widget's tab label on the indicator", required=False)), ('title', wagtail.core.blocks.CharBlock()), ('hide_title', wagtail.core.blocks.BooleanBlock(default=False, required=False)), ('html', wagtail.documents.blocks.DocumentChooserBlock(required=True)), ('sdg', wagtail.core.blocks.ChoiceBlock(choices=[('', 'Please select an SDG'), ('no-poverty', 'No Poverty'), ('zero-hunger', 'Zero Hunger'), ('good-health-and-well-being', 'Good Health and Well-being'), ('quality-education', 'Quality Education'), ('gender-equality', 'Gender Equality'), ('clean-water-and-sanitation', 'Clean Water and Sanitation'), ('affordable-and-clean-energy', 'Affordable and Clean Energy'), ('decent-jobs-and-economic-growth', 'Decent Jobs and Economic Growth'), ('industry-innovation-and-infrastructure', 'Industry, Innovation and Infrastructure'), ('reduced-inequalities', 'Reduced Inequalities'), ('sustainable-cities-and-communities', 'Sustainable Cities and Communities'), ('responsible-consumption-and-production', 'Responsible Consumption and Production'), ('climate-action', 'Climate Action'), ('life-below-water', 'Life Below Water'), ('life-on-land', 'Life on Land'), ('peace-and-justice-strong-institutions', 'Peace and Justice - Strong Institutions'), ('partnerships-for-the-goals', 'Partnerships for the Goals')], label='SDG Goal', required=False)), ('source', wagtail.core.blocks.RichTextBlock(features=['link'], required=False))])), ('hurumap', wagtail.core.blocks.StructBlock([('title', wagtail.core.blocks.CharBlock(default='', required=True)), ('data_country', wagtail.core.blocks.ChoiceBlock(choices=[('ET', 'Ethiopia'), ('KE', 'Kenya'), ('NG', 'Nigeria'), ('SN', 'Senegal'), ('TZ', 'Tanzania')], label='Country')), ('data_id', wagtail.core.blocks.ChoiceBlock(choices=[('demographics-residence_dist', 'Population by Residence'), ('demographics-sex_dist', 'Population by Sex'), ('crops-crop_distribution', 'Crops Produced'), ('health_centers-prevention_methods_dist', 'Knowledge of HIV Prevention Methods'), ('education-education_reached_distribution', 'Highest Level of Education Attained'), ('education-school_attendance_distribution', 'School Attendance by Sex'), ('donors-donor_assistance_dist', 'Principal Donors'), ('poverty-poverty_residence_dist', 'Percentage of Population living in Poverty by Residence'), ('poverty-poverty_age_dist', 'Percentage of Population living in Poverty by Age and Residence'), ('fgm-fgm_age_dist', 'Percentage of Women that have undergone FGM by Age'), ('security-seized_firearms_dist', 'Seized Firearms'), ('donors-donor_programmes_dist', 'Donor Funded Programmes'), ('budget-government_expenditure_dist', 'Government Expenditure'), ('health_centers-health_centers_dist', 'Number of health centers by type'), ('worldbank-cereal_yield_kg_per_hectare', 'Cereal Yield in Kg Per Hectare'), ('worldbank-agricultural_land', 'Agricultural land (% of land area)'), ('worldbank-gini_index', 'GINI Index'), ('worldbank-access_to_basic_services', 'People using at least basic drinking water services (% of population)'), ('worldbank-primary_school_enrollment', 'School enrollment, primary, male (% gross)'), ('worldbank-account_ownership', 'Account ownership at a financial institution or with a mobile-money-service provider, (% of population ages 15+)'), ('worldbank-youth_unemployment', 'Unemployment, youth (% of labor force ages 15-24) (modeled ILO estimate)'), ('worldbank-adult_literacy_rate', 'Literacy rate, adult (% of population ages 15 and above)'), ('worldbank-foreign_direct_investment_net_inflows', 'Foreign direct investment, net inflows (% of GDP)'), ('worldbank-maternal_mortality', 'Maternal mortality ratio (modeled estimate, per 100,000 live births)'), ('worldbank-hiv_prevalence', 'Prevalence of HIV, (% ages 15-24)'), ('worldbank-employment_to_population_ratio', 'Employment to population ratio, 15+, (%) (modeled ILO estimate)'), ('worldbank-gdp_per_capita', 'GDP per capita (current US$)'), ('worldbank-primary_education_completion_rate', 'Primary completion rate,(% of relevant age group)'), ('worldbank-secondary_school_enrollment', 'School enrollment, secondary (% gross)'), ('worldbank-nurses_and_midwives', 'Nurses and midwives (per 1,000 people)'), ('worldbank-mobile_phone_subscriptions', 'Mobile Phone Subscriptions(per 100 people)'), ('worldbank-gdp_per_capita_growth', 'GDP per capita growth (annual %)'), ('worldbank-prevalence_of_undernourishment', 'Prevalence of undernourishment (% of population)'), ('worldbank-life_expectancy_at_birth', 'Life Expectancy At Birth (Years)'), ('worldbank-tax_as_percentage_of_gdp', 'Tax As Percentage Of GDP'), ('worldbank-births_attended_by_skilled_health_staff', 'Births Attended By Skilled Health Staff (% of total)'), ('worldbank-incidence_of_malaria_per_1000_pop_at_risk', 'Incidence Of Malaria Per 1000 Population At Risk'), ('worldbank-tax_revenue', 'Tax revenue (current LCU)'), ('worldbank-gdp', 'GDP'), ('worldbank-gdp_growth', 'GDP Growth')], label='Data')), ('chart_type', wagtail.core.blocks.ChoiceBlock(choices=[('histogram', 'Histogram'), ('pie', 'Pie Chart'), ('grouped_column', 'Grouped Column')], label='Chart Type')), ('data_stat_type', wagtail.core.blocks.ChoiceBlock(choices=[('dollar', 'Dollar'), ('number', 'Number'), ('percentage', 'Percentage'), ('scaled-percentage', 'Scaled Percentage')], label='Stat Type')), ('chart_height', wagtail.core.blocks.IntegerBlock(help_text='Default is 300px', label='Chart Height', required=False)), ('data_source_link', wagtail.core.blocks.URLBlock(label='Source URL', required=False)), ('data_source_title', wagtail.core.blocks.CharBlock(label='Source Title', required=False)), ('chart_qualifier', wagtail.core.blocks.RichTextBlock(features=['h5', 'h6', 'ol', 'ul', 'bold', 'italic', 'hr', 'link'], help_text='Chart context e.g. legend, universe, etc.', label='Chart Qualifier', required=False)), ('description', wagtail.core.blocks.TextBlock(label='Description of the data', required=False))]))], max_num=1, min_num=1))]))], max_num=2))]))], blank=True),
        ),
    ]