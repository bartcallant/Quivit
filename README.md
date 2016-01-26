#Realtime tracking van voetbalwedstrijden

## Korte beschrijving

Deze applicatie streeft ernaar om realtime de posities van spelers en bal in een voetbalspel weer te geven. Deze data wordt live gepresenteerd via een webinterface en opgeslagen in een database voor latere analyse. Op basis van de opgeslagen data worden bijvoorbeeld ook heat maps opgesteld. 

##Implementatie

###Hardware

De data die we in onze applicatie gebruiken, wordt gegenereerd door een wisselwerking van beacons (verzenden Bluetooth-signalen) en iPhones (ontvangen Bluetooth-signalen). Wij maken gebruik van beacons van het merk Estimote, omdat deze standaard komen met een goede SDK voor het berekenen van posities en locaties van objecten. 

Wanneer de iPhone via de Estimote Indoor Location SDK informatie ontvangt over zijn eigen positie, zendt hij die via sockets door naar een server. Deze server slaat de locatiedata op in een database (MongoDB) en stuurt ze tegelijkertijd via sockets verder naar aangesloten clients.  

###Functionaliteit front-end

-	Liveweergave van een voetbalmatch wanneer deze bezig is. Veld, spelers en bal zijn op voldoende wijze van elkaar te onderscheiden. 
-	Achteraf kunnen wedstrijden opnieuw bekeken worden. 
- Er kunnen heatmaps van speler gegenereerd worden. 
-	Er is een managementinterface voorzien waarin kan aangegeven worden welke speler gekoppeld is aan welke iPhone. 
-	Wedstrijden kunnen lokaal opgeslagen worden om offline bekeken te worden. 


## Inhoud

- [Finaal projectdossier](https://github.com/KristofColpaert/NMCTBackFront/blob/master/Projectdossier_MartijnLoth_BartCallant_KristofColpaert.docx)
- [Finale versie frontend](https://github.com/KristofColpaert/NMCTBackFront/tree/master/Frontend/0.1.1)
- [Finale versie backend](https://github.com/KristofColpaert/NMCTBackFront/tree/master/Backend/Client/1.0.0)
