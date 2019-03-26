# ramverk2-projekt-api

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/10e576c1285b4c11a9d1934aae430221)](https://app.codacy.com/app/OllieJohnsson/ramverk2-projekt-api?utm_source=github.com&utm_medium=referral&utm_content=OllieJohnsson/ramverk2-projekt-api&utm_campaign=Badge_Grade_Dashboard)

API för projektet i kursen ramverk2.


Gör ett medvetet val av teknik och berätta utförligt i din README om vilka teknikval du har gjort och varför.


För routingen av mitt API valde jag att använda **Express**. Det är ett ramverk jag använt tidigare och verkar vara det överlägset populäraste. För att autensiera användare valde jag **jsonwebtoken**. Om rätt uppgifter anges och rätt env-variabel är satt returneras en token i form av en sträng. Användarnas lösenord krypteras med hjälp av **bcrypt** för att öka säkerheten ytterligare. Databasen valde jag att skapa i **MYSQL**. Jag kände att jag hade större kontroll där jämfört med **MONGODB**. MYSQL är bland annat striktare när det kommer till tabellers innehåll och har relationer mellan tabeller så man slipper duplicera data. För att hålla min javascript-kod renare och mer lättläst, skapade jag en del procedures i databasen för exempelvis `buy` och `sell`. Jag hittade inget motsavrande i MONGODB.
