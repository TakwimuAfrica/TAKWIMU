from django.conf import settings


def get_country_geo_code(geo):
    geo_code = 'afr'
    level = geo.geo_level.lower()
    if level != 'continent':
        geo_code = geo.geo_code \
            if level == 'country' \
            else geo.ancestors()[-1].geo_code

    return geo_code.lower(), level


def get_page_releases_per_country(dataset_name, geo, year, filter_releases=True):
    """
    Return the active release being viewed and a list of related releases
    for a geo and dataset
    """
    from wazimap.models import Dataset

    releases = {}
    releases.setdefault('other', [])

    query = Dataset.objects.get(name=dataset_name).releases.order_by('-year')

    print query

    # get the available releases for this country
    country_code, level = get_country_geo_code(geo)
    country_releases = settings.HURUMAP['available_releases_years_per_country'].get(country_code)
    available_years = country_releases.get(level)

    if filter_releases and available_years:
        query = query.filter(year__in=available_years)

    dataset_releases = [
        r.as_dict() for r in query.all()]

    # since countries might have census in different years, always make the latest the primary dataset

    releases['active'] = dataset_releases[0]
    releases['other'] = dataset_releases[1:]

    return releases


def get_primary_release_year_per_geography(geo):
    country_code, level = get_country_geo_code(geo)
    country_primary_releases = settings.HURUMAP['primary_release_year'].get(country_code)
    return country_primary_releases.get(level, 'latest')
