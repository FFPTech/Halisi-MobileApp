export const getCountryCode = (country) => {
  const countryMap = {
    Kenya: 'KE',
    'Democratic Republic of Congo': 'COD',
    Belgium: 'BE',
    Tanzania: 'TZ',
    Zambia: 'ZM',
    India: 'IN',
  }
  return countryMap[country] || ''
}
