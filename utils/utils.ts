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

export function getCurrentTimestamp() {
  const now = new Date()
  const pad = (n) => n.toString().padStart(2, '0')
  return (
    now.getFullYear() +
    '-' +
    pad(now.getMonth() + 1) +
    '-' +
    pad(now.getDate()) +
    ' ' +
    pad(now.getHours()) +
    ':' +
    pad(now.getMinutes()) +
    ':' +
    pad(now.getSeconds())
  )
}
