# ramverk2-projekt-api
API för projektet i kursen ramverk2.

[![Build Status](https://travis-ci.org/OllieJohnsson/ramverk2-projekt-api.svg?branch=master)](https://travis-ci.org/OllieJohnsson/ramverk2-projekt-api)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0386893d17ad44daa207d388bb6440c5)](https://www.codacy.com/app/OllieJohnsson/ramverk2-projekt-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=OllieJohnsson/ramverk2-projekt-api&amp;utm_campaign=Badge_Grade)

[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/0386893d17ad44daa207d388bb6440c5)](https://www.codacy.com/app/OllieJohnsson/ramverk2-projekt-api?utm_source=github.com&utm_medium=referral&utm_content=OllieJohnsson/ramverk2-projekt-api&utm_campaign=Badge_Coverage)



<!-- Gör ett medvetet val av teknik och berätta utförligt i din README om vilka teknikval du har gjort och varför. -->


För routingen av mitt API valde jag att använda **Express**. Det är ett ramverk jag använt tidigare och verkar vara det överlägset populäraste. För att autensiera användare valde jag **jsonwebtoken**. Om rätt uppgifter anges och rätt env-variabel är satt returneras en token i form av en sträng. Användarnas lösenord krypteras med hjälp av **bcrypt** för att öka säkerheten ytterligare. Databasen valde jag att skapa i **MYSQL**. Jag kände att jag hade större kontroll där jämfört med **MONGODB**. MYSQL är bland annat striktare när det kommer till tabellers innehåll och har relationer mellan tabeller så man slipper duplicera data. För att hålla min javascript-kod renare och mer lättläst, skapade jag en del procedures i databasen för exempelvis `buy` och `sell`. Jag hittade inget motsavrande i MONGODB.




### Tester backend

<!-- Du har god kodtäckning i enhetstester och funktionstester på både backend och frontend. Sträva efter 70% där det är rimligt, men se det som en riktlinje och inte ett hårt krav.

I din README skriver du ett stycke om vilka verktyg du använt för din testsuite och om det är delar av applikationen som inte täcks av tester. Du reflekterar kort över hur dina teknikval fungerat för dig. Du reflekterar också över hur lätt/svårt det är att få kodtäckning på din applikation. -->

För mina tester har jag använt **Mocha** och **Chai** som jag testat tidigare under kursen och tycker fungerar bra. Kodtäckningen sammanställs av **Istanbull** och dess cli **nyc**. Det var ganska enkelt att få kodtäckning över min kod. Jag gick uppifrån och ner och täckte upp de olika scenarierna. Hade jag haft mer tid hade jag kunnat nå högre täckning, men jag nöjde mig med 84%. För att kunna göra test som krävde inloggning använde jag en `before()` hook som återställer test-databasen och loggar in en användare.

För att se kodtäckningen lokalt i webbläsaren körs följande kommandon:
```
mysql -uroot -p**root password** < db/sql/setup_test.sql
npm test
open coverage/index.html
```

För att automatisera mina tester använde jag byggtjänsten **Travis** som jag också använt tidigare. Kodens kvalitet och täckning analyseas av **Codacy**. De gav min kod betyget **B**, vilket jag tycker är rimligt. 


<!-- Man kan köra hela din testsuite lokalt via npm test.

I README visar du hur man kan se kodtäckningen lokalt i webbläsaren.

Dina repon har en CI-kedja och automatiserade tester med tillhörande badges för byggtjänst, kodtäckning och tjänst för kodkvalitet.

I din README skriver du ett stycke om CI-kedjan, vilka tjänster du valt och varför samt eventuella begränsningar i hur CI-kedjan kan hantera din applikation. Du gör en kort reflektion över din syn på den hjälpen liknande verktyg ger dig.

Berätta om du är nöjd eller inte med de betyg som tjänsten för kodkvalitet ger dig. -->
