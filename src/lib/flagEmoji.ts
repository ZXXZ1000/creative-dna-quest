// Helper to render flag emoji by country/region name.
// Uses ISO alpha-2 codes; names mapped to codes below.

export function codeToFlagEmoji(code: string): string {
  const cc = code.toUpperCase();
  if (cc.length !== 2) return '🌍';
  const A = 0x1f1e6; // Regional Indicator Symbol Letter A
  const res = Array.from(cc).map(c => String.fromCodePoint(A + (c.charCodeAt(0) - 65))).join('');
  return res;
}

// Name -> ISO alpha-2 code
export const NAME_TO_CODE: Record<string, string> = {
  // Special domestic standard
  'China (Mainland)': 'CN',
  'Hong Kong, China': 'HK',
  'Macao, China': 'MO',
  'Taiwan, China': 'CN',

  // Americas
  'United States': 'US', 'Canada': 'CA', 'Mexico': 'MX', 'Argentina': 'AR', 'Brazil': 'BR', 'Chile': 'CL', 'Colombia': 'CO', 'Peru': 'PE', 'Uruguay': 'UY', 'Venezuela': 'VE', 'Ecuador': 'EC', 'Paraguay': 'PY', 'Bolivia': 'BO', 'Guyana': 'GY', 'Suriname': 'SR', 'Belize': 'BZ', 'Guatemala': 'GT', 'Honduras': 'HN', 'El Salvador': 'SV', 'Nicaragua': 'NI', 'Costa Rica': 'CR', 'Panama': 'PA', 'Cuba': 'CU', 'Dominican Republic': 'DO', 'Haiti': 'HT', 'Jamaica': 'JM', 'Trinidad and Tobago': 'TT', 'Barbados': 'BB', 'Bahamas': 'BS', 'Saint Kitts and Nevis': 'KN', 'Antigua and Barbuda': 'AG', 'Saint Lucia': 'LC', 'Saint Vincent and the Grenadines': 'VC', 'Dominica': 'DM', 'Grenada': 'GD', 'Puerto Rico': 'PR', 'Bermuda': 'BM', 'Cayman Islands': 'KY', 'Montserrat': 'MS', 'Turks and Caicos Islands': 'TC', 'Saint Pierre and Miquelon': 'PM',

  // Europe
  'United Kingdom': 'GB', 'Ireland': 'IE', 'France': 'FR', 'Germany': 'DE', 'Spain': 'ES', 'Portugal': 'PT', 'Italy': 'IT', 'Netherlands': 'NL', 'Belgium': 'BE', 'Switzerland': 'CH', 'Austria': 'AT', 'Denmark': 'DK', 'Norway': 'NO', 'Sweden': 'SE', 'Finland': 'FI', 'Iceland': 'IS', 'Poland': 'PL', 'Czechia (Czech Republic)': 'CZ', 'Slovakia': 'SK', 'Slovenia': 'SI', 'Croatia': 'HR', 'Bosnia and Herzegovina': 'BA', 'Serbia': 'RS', 'Albania': 'AL', 'Montenegro': 'ME', 'North Macedonia': 'MK', 'Greece': 'GR', 'Hungary': 'HU', 'Romania': 'RO', 'Bulgaria': 'BG', 'Moldova': 'MD', 'Ukraine': 'UA', 'Belarus': 'BY', 'Russia': 'RU', 'Georgia': 'GE', 'Armenia': 'AM', 'Azerbaijan': 'AZ', 'Andorra': 'AD', 'Monaco': 'MC', 'Liechtenstein': 'LI', 'San Marino': 'SM', 'Holy See': 'VA', 'Gibraltar': 'GI', 'Guernsey': 'GG', 'Jersey': 'JE', 'Isle of Man': 'IM', 'Greenland': 'GL',

  // Asia
  'Japan': 'JP', 'South Korea': 'KR', 'North Korea': 'KP', 'Mongolia': 'MN', 'India': 'IN', 'Pakistan': 'PK', 'Bangladesh': 'BD', 'Sri Lanka': 'LK', 'Nepal': 'NP', 'Bhutan': 'BT', 'Maldives': 'MV', 'Myanmar (Burma)': 'MM', 'Thailand': 'TH', 'Laos': 'LA', 'Cambodia': 'KH', 'Vietnam': 'VN', 'Malaysia': 'MY', 'Singapore': 'SG', 'Indonesia': 'ID', 'Brunei': 'BN', 'Philippines': 'PH', 'Timor-Leste': 'TL', 'Kazakhstan': 'KZ', 'Kyrgyzstan': 'KG', 'Tajikistan': 'TJ', 'Turkmenistan': 'TM', 'Uzbekistan': 'UZ', 'Iran': 'IR', 'Iraq': 'IQ', 'Israel': 'IL', 'Jordan': 'JO', 'Lebanon': 'LB', 'Syria': 'SY', 'United Arab Emirates': 'AE', 'Saudi Arabia': 'SA', 'Qatar': 'QA', 'Bahrain': 'BH', 'Kuwait': 'KW', 'Oman': 'OM', 'Yemen': 'YE',

  // Africa
  'South Africa': 'ZA', 'Egypt': 'EG', 'Morocco': 'MA', 'Algeria': 'DZ', 'Tunisia': 'TN', 'Libya': 'LY', 'Sudan': 'SD', 'South Sudan': 'SS', 'Ethiopia': 'ET', 'Eritrea': 'ER', 'Djibouti': 'DJ', 'Somalia': 'SO', 'Kenya': 'KE', 'Uganda': 'UG', 'Tanzania': 'TZ', 'Rwanda': 'RW', 'Burundi': 'BI', 'DRC': 'CD', 'Democratic Republic of the Congo': 'CD', 'Congo (Congo-Brazzaville)': 'CG', 'Nigeria': 'NG', 'Ghana': 'GH', 'Cameroon': 'CM', 'Senegal': 'SN', "Côte d'Ivoire": 'CI', 'Sierra Leone': 'SL', 'Liberia': 'LR', 'Guinea': 'GN', 'Guinea-Bissau': 'GW', 'Gabon': 'GA', 'Equatorial Guinea': 'GQ', 'Chad': 'TD', 'Central African Republic': 'CF', 'Niger': 'NE', 'Mali': 'ML', 'Burkina Faso': 'BF', 'Benin': 'BJ', 'Togo': 'TG', 'Mauritania': 'MR', 'Gambia': 'GM', 'Cape Verde': 'CV', 'Cabo Verde': 'CV', 'Madagascar': 'MG', 'Malawi': 'MW', 'Zambia': 'ZM', 'Zimbabwe': 'ZW', 'Mozambique': 'MZ', 'Namibia': 'NA', 'Botswana': 'BW', 'Angola': 'AO', 'Seychelles': 'SC', 'Mauritius': 'MU', 'Sao Tome and Principe': 'ST', 'Comoros': 'KM', 'Eswatini': 'SZ', 'Eswatini': 'SZ',

  // Oceania
  'Australia': 'AU', 'New Zealand': 'NZ', 'Fiji': 'FJ', 'Papua New Guinea': 'PG', 'Samoa': 'WS', 'Tonga': 'TO', 'Tuvalu': 'TV', 'Vanuatu': 'VU', 'Kiribati': 'KI', 'Nauru': 'NR', 'Palau': 'PW', 'Marshall Islands': 'MH', 'Micronesia': 'FM', 'New Caledonia': 'NC', 'French Polynesia': 'PF', 'Wallis and Futuna': 'WF', 'Niue': 'NU', 'Tokelau': 'TK', 'Aruba': 'AW', 'Curaçao': 'CW', 'Guadeloupe': 'GP', 'Martinique': 'MQ', 'Mayotte': 'YT', 'Réunion': 'RE', 'Saint Barthélemy': 'BL', 'Saint Martin': 'MF', 'Sint Maarten': 'SX'
};

export function flagEmojiForName(name?: string): string {
  if (!name) return '🌍';
  const key = name.trim();
  const code = NAME_TO_CODE[key];
  if (code) return codeToFlagEmoji(code);
  // Try fallbacks for SAR spellings
  if (/hong\s*kong/i.test(key)) return codeToFlagEmoji('HK');
  if (/macao|macau/i.test(key)) return codeToFlagEmoji('MO');
  if (/taiwan/i.test(key)) return codeToFlagEmoji('CN');
  if (/china/i.test(key)) return codeToFlagEmoji('CN');
  return '🌍';
}
