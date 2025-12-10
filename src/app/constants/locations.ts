/**
 * @file locations.ts
 * @description Constants for countries and cities with their timezones
 * Data based on backend pkg/timeutil/city_timezone.go
 */

export interface CountryOption {
  value: string;
  label: string;
  iso: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { value: 'United States', label: 'United States', iso: 'us', flag: 'https://flagcdn.com/us.svg' },
  { value: 'Canada', label: 'Canada', iso: 'ca', flag: 'https://flagcdn.com/ca.svg' },
  { value: 'Mexico', label: 'Mexico', iso: 'mx', flag: 'https://flagcdn.com/mx.svg' },

  {
    value: 'United Kingdom',
    label: 'United Kingdom',
    iso: 'gb',
    flag: 'https://flagcdn.com/gb.svg',
  },
  { value: 'Germany', label: 'Germany', iso: 'de', flag: 'https://flagcdn.com/de.svg' },
  { value: 'France', label: 'France', iso: 'fr', flag: 'https://flagcdn.com/fr.svg' },
  { value: 'Italy', label: 'Italy', iso: 'it', flag: 'https://flagcdn.com/it.svg' },
  { value: 'Spain', label: 'Spain', iso: 'es', flag: 'https://flagcdn.com/es.svg' },
  { value: 'Netherlands', label: 'Netherlands', iso: 'nl', flag: 'https://flagcdn.com/nl.svg' },

  { value: 'Russia', label: 'Russia', iso: 'ru', flag: 'https://flagcdn.com/ru.svg' },
  { value: 'Kazakhstan', label: 'Kazakhstan', iso: 'kz', flag: 'https://flagcdn.com/kz.svg' },
  { value: 'Uzbekistan', label: 'Uzbekistan', iso: 'uz', flag: 'https://flagcdn.com/uz.svg' },
  { value: 'Kyrgyzstan', label: 'Kyrgyzstan', iso: 'kg', flag: 'https://flagcdn.com/kg.svg' },
  { value: 'Tajikistan', label: 'Tajikistan', iso: 'tj', flag: 'https://flagcdn.com/tj.svg' },
  { value: 'Turkmenistan', label: 'Turkmenistan', iso: 'tm', flag: 'https://flagcdn.com/tm.svg' },

  { value: 'Turkey', label: 'Turkey', iso: 'tr', flag: 'https://flagcdn.com/tr.svg' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia', iso: 'sa', flag: 'https://flagcdn.com/sa.svg' },
  { value: 'Qatar', label: 'Qatar', iso: 'qa', flag: 'https://flagcdn.com/qa.svg' },
  { value: 'UAE', label: 'UAE', iso: 'ae', flag: 'https://flagcdn.com/ae.svg' },

  { value: 'China', label: 'China', iso: 'cn', flag: 'https://flagcdn.com/cn.svg' },
  { value: 'Japan', label: 'Japan', iso: 'jp', flag: 'https://flagcdn.com/jp.svg' },
  { value: 'South Korea', label: 'South Korea', iso: 'kr', flag: 'https://flagcdn.com/kr.svg' },
  { value: 'India', label: 'India', iso: 'in', flag: 'https://flagcdn.com/in.svg' },
  { value: 'Singapore', label: 'Singapore', iso: 'sg', flag: 'https://flagcdn.com/sg.svg' },

  { value: 'Brazil', label: 'Brazil', iso: 'br', flag: 'https://flagcdn.com/br.svg' },
  { value: 'Argentina', label: 'Argentina', iso: 'ar', flag: 'https://flagcdn.com/ar.svg' },

  { value: 'Australia', label: 'Australia', iso: 'au', flag: 'https://flagcdn.com/au.svg' },

  { value: 'Egypt', label: 'Egypt', iso: 'eg', flag: 'https://flagcdn.com/eg.svg' },
  { value: 'South Africa', label: 'South Africa', iso: 'za', flag: 'https://flagcdn.com/za.svg' },
];

export const CITIES: Record<string, string[]> = {
  'United States': [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'Austin',
    'Jacksonville',
    'San Francisco',
    'Seattle',
    'Denver',
    'Miami',
    'Boston',
  ],
  Uzbekistan: ['Tashkent', 'Samarkand', 'Bukhara'],
  Russia: [
    'Moscow',
    'Saint Petersburg',
    'Novosibirsk',
    'Yekaterinburg',
    'Kazan',
    'Nizhny Novgorod',
    'Chelyabinsk',
    'Samara',
    'Omsk',
    'Rostov-on-Don',
  ],
  'United Kingdom': [
    'London',
    'Manchester',
    'Birmingham',
    'Glasgow',
    'Liverpool',
    'Leeds',
    'Edinburgh',
    'Bristol',
  ],
  Germany: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Dusseldorf'],
  France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg'],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
  Canada: [
    'Toronto',
    'Vancouver',
    'Montreal',
    'Calgary',
    'Ottawa',
    'Edmonton',
    'Winnipeg',
    'Quebec City',
  ],
  Australia: [
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Gold Coast',
    'Canberra',
  ],
  Japan: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka'],
  China: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan'],
  India: [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
  ],
  Singapore: ['Singapore'],
  Kazakhstan: ['Almaty', 'Astana', 'Shymkent', 'Karaganda'],
  Kyrgyzstan: ['Bishkek', 'Osh'],
  Tajikistan: ['Dushanbe', 'Khujand'],
  Turkmenistan: ['Ashgabat', 'Turkmenabat'],
  Turkey: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
  Qatar: ['Doha', 'Al Wakrah'],
  Italy: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna'],
  Spain: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  Brazil: [
    'Sao Paulo',
    'Rio de Janeiro',
    'Brasilia',
    'Salvador',
    'Fortaleza',
    'Belo Horizonte',
  ],
  Mexico: ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun', 'Tijuana'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'],
  Thailand: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya'],
  Vietnam: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hue'],
  Egypt: ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
};
