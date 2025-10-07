---
sidebar_position: 5
---

# Formatter  
- [Formatter](#formatter)
  - [Intl.NumberFormat](#intlnumberformat)
    - [formatNumber (insertComma)](#formatnumber-insertcomma)


## Intl.NumberFormat   

`Intl.NumberFormat` 객체는 JavaScript에서 숫자를 특정 로케일과 형식에 맞게 포맷하는 데 사용
- 대한민국에서는 숫자에 콤마를 넣는게 당연한데 다른 국가에서는 그렇지 않은 경우도 있다.   
- `new Intl.NumberFormat('ko-KR')`은 한국어(Korean) 형식으로 숫자를 포맷하는 객체를 생성 하며 국제화가 진행된다면 국가별 포멧팅을 지원하자.  
- 주요 정책 설정 필요한 항목들   
  - 1.통화 표기   
  - 2.숫자 포멧팅  
  - 3.시간 표기  

1. 기본 숫자 포맷팅:
   ```javascript
   const numberFormatter = new Intl.NumberFormat('ko-KR');
   const formattedNumber = numberFormatter.format(1234567.89);
   console.log(formattedNumber); // "1,234,567.89"
   ```

2. 통화 형식으로 포맷팅  
   ```javascript
   const currencyFormatter = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' });
   const formattedCurrency = currencyFormatter.format(1234567.89);
   console.log(formattedCurrency); // "₩1,234,567"
   ```

3. 백분율 형식으로 포맷팅  
   ```javascript
   const percentFormatter = new Intl.NumberFormat('ko-KR', { style: 'percent' });
   const formattedPercent = percentFormatter.format(0.1234);
   console.log(formattedPercent); // "12%"
   ```

4. 정밀도 설정  
   소수점 이하 자리수를 설정할 수 있습니다.
   ```javascript
   const preciseFormatter = new Intl.NumberFormat('ko-KR', { 
      minimumFractionDigits: 2, // 적어도 소수점 2자리 표기, 100 -> 100.00으로 채움
      maximumFractionDigits: 3  //
   });
   const formattedPrecise = preciseFormatter.format(1234567.89);
   console.log(formattedPrecise); // "1,234,567.89"
   ```

5. 사용자 정의 설정:
   사용자 정의 설정을 사용하여 숫자 포맷팅을 세부 조정할 수 있습니다.
   ```javascript
   const customFormatter = new Intl.NumberFormat('ko-KR', {
     style: 'currency',
     currency: 'KRW',
     minimumFractionDigits: 0,
     maximumFractionDigits: 0
   });
   const formattedCustom = customFormatter.format(1234567.89);
   console.log(formattedCustom); // "₩1,234,568"
   ```


`Intl.NumberFormat` 객체를 사용하면 숫자를 로케일에 맞게 손쉽게 포맷할 수 있습니다. 한국어 형식으로 숫자를 포맷할 때는 `new Intl.NumberFormat('ko-KR')`을 사용하며, 통화, 백분율, 정밀도 등 다양한 옵션을 추가하여 세부적인 포맷팅을 수행할 수 있습니다. 이를 통해 숫자를 사용자에게 더욱 이해하기 쉽게 표시할 수 있습니다.


### formatNumber (insertComma)

```jsx
const formatter = new Intl.NumberFormat('ko-KR');

export const formatNumber = (value: number) => {
  return formatter.format(value);
};
```

반올림 처리 

```js
export const roundUnit = (value: number, unit: number) => {
  return Math.round(value / unit) * unit;
};
```