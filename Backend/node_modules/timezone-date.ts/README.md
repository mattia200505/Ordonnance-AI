# timezone-date.ts

Enhancement of Date class with better timezone support.

[![npm Package Version](https://img.shields.io/npm/v/timezone-date.ts)](https://www.npmjs.com/package/timezone-date.ts)
[![npm Package Version](https://img.shields.io/bundlephobia/min/timezone-date.ts)](https://bundlephobia.com/package/timezone-date.ts)
[![npm Package Version](https://img.shields.io/bundlephobia/minzip/timezone-date.ts)](https://bundlephobia.com/package/timezone-date.ts)

## Features
- Compliant to `Date` methods
- Allow changing timezone anytime
- Typescript support
- Tiny code base (below 1KB minizipped)

## Example
Jump between timezones:
```typescript
import { TimezoneDate } from 'timezone-date.ts'

const d = TimezoneDate.fromDate(new Date('2020-04-21T10:00:00.000Z'))

d.timezone = 0
d.getHours() // 10

d.timezone = +8
d.getHours() // 18

d.getTimezoneOffset() // -480 (in mintes, same format as Native Date)

d.setHours(9)
d.timezone++
d.getHours() // 10
d.toLocaleTimeString() // '10:00:00 AM'
```

Set a specific time (e.g. from UI input)
```typescript
let date = new TimezoneDate()
date.timezone = +8
date.setFullYear(2020, 11 - 1, 28)
date.setHours(9, 2, 38)
console.log(date.toString()) // Sat Nov 28 2020 09:02:38 GMT+0800 (Hong Kong Standard Time)
```

## Installation
```bash
npm i timezone-date.ts
```
## Construction
```typescript
import { TimezoneDate } from 'timezone-date.ts'

/* custom timezone */
new TimezoneDate(Date.now(), {timezone: +8})

/* default timezone (in the environment) */
new TimezoneDate()                 // current time
new TimezoneDate(Date.now())
TimezoneDate.fromTime(Date.now())
TimezoneDate.fromDate(new Date())
TimezoneDate.from(Date.now())      // from Date or timestamp
```

## License
This is free open sourced software (FOSS), with [BSD 2-Clause License](./LICENSE)
