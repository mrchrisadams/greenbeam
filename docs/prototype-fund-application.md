### Surname

Adams

### First name 
Chris

### E-mail address
chris@productscience.net

### GitHub / BitBucket Accounts 
https://github.com/mrchrisadams/

### Which open source projects have you worked on so far? (max 3 with links)

- Wordpress Coding Standards Code Sniffer - geupdatet, dann das Projekt veröffentlicht, dann war ich Maintainer - https://github.com/mrchrisadams/WordPress-Coding-Standards
- Firefox browser - Codebeitrag als Ehrenamtlicher
- Patchwork - Codebeitrag für ein dezentrales, soziales Netzwerk 

Are you looking to apply as a team? (y/n) *

yes

### Names of the team members:

- Chris Adams
- Eve Ahearn 
- Claire Webster
- Nils von Delft

### Project title * 

Greenbeam

### Assign the project to an area
Data Literacy

### How does your project relate to the focus of this round?

700 chars max

Greenbeam helps answer the question of “How can technology contribute to and promote environmental sustainability? Which structures are conducive to this, which architectures should be chosen or developed?
Greenbeam makes it easier to see how the web you use works, and understand how much of the existing infrastructure that the web runs on runs on fossil fuels. It does this in two ways:

As you browse use the web, it builds up a data visualisation of which infrastructure from which organisations you rely on, and lets you see what information is available about their policies about how they power their infrastructure.
Also, every page you visit, it sends a request using the new “carbon.txt” standard, requesting structured data, and surfacing showing demand for green infrastructure.

#### Auf deutsch/DeepL
Greenbeam macht es einfacher zu sehen, wie das vom Benutzer verwendete Web funktioniert, und hilft ihr oder ihm zu verstehen, wie viel von der bestehenden Internetinfrastruktur, auf fossilen Brennstoffen basiert.

Dies geschieht auf zwei Arten:

Während er oder sie im Internet surft, baut Greenbeam eine Datenvisualisierung darüber auf, welche Infrastruktur von welchen Organisationen er oder sie dazu verwendet, und zeigt Informationen über deren verfügbare Richtlinien darüber, wie sie ihre Infrastruktur betreiben, an.

Außerdem sendet Greenbeam eine Anfrage nach dem neuen Standard "carbon.txt" an jede Webseite, die besucht wird. Die Anfrage fordert strukturierte Daten an und macht die Nachfrage nach einer grüneren Infrastruktur für die Betreiber deutlich.

### Give a brief description of your project

Max. 700 Zeichen

Greenbeam builds on two open source projects funded though earlier prototypefund rounds - “The Open Green Web”, and “Lightbeam” - to use the architecture of the web to do things browsers currently do not do. 

ask questions about what kind of power the sites use, in an automated way. Just like when search engine web crawlers ask a website what content it has, by requesting a special “robots.txt” file, the browser extension does the same by requesting  a ‘carbon.txt’ file listing how every site visited is powered.
make what is already known visible, by generating visually engaging data visualisations showing how they are powered and how much you use them

#### Auf Deutsch - 700 chars max.

Greenbeam baut auf zwei früheren Prototypfund-finanzierten Open Source Projekten auf - "The Open Green Web" und "Lightbeam" - welche  die Architektur des Webs zu nutzen und Dinge zu ermöglichen, die Browser derzeit nicht unterstützen.

1. Automatisierte Anfragen zu Energieträgern, die eine Webseite nutzt. Genau wie Suchmaschinen-Webcrawler, die Inhalte einer Webseite erfragen, indem sie eine spezielle "robots.txt"-Datei anfordern, fordert die  Browsererweiterung eine "carbon.txt"-Datei mit Informationen zu den Energieträgern an.
2. das bereits Bekannte sichtbar machen, indem ansprechende Datenvisualisierungen erstellt werden, welche die Funktion und die Nutzung erläutern.

### What societal problem do you want to solve with your project?

Max. 700 Zeichen

By default in this industry, when we use the web we rely on infrastructure that uses huge amounts of fossil fuels, when it does not need to use them. This means that every time we use the web, it causes avoidable harm.

But because we do not see the fossil fuels being burned to power the servers we use, even if we preferred them to run on renewable power, we don’t have a clear way to ask the people who build the web that we use, to switch.

If you build digital services and you can see that your users are asking you to use green power, we think it is easier to argue for that switch internally.

So, that is what we want to do with greenbeam.

#### Auf Deutsch - 700 chars max


Standardmäßig verlassen wir uns bei der Nutzung des Internets auf Infrastruktur, die große Mengen an fossilen Brennstoffen verbraucht, obwohl das nicht nötig wäre. Das bedeutet, dass jedes Mal, wenn wir das Web nutzen, vermeidbare Schäden entstehen.

Aber da wir nicht sehen, dass fossile Brennstoffe zum Serverbetrieb verbrannt werden haben wir keine einfache Möglichkeit, die Betreiber zu bitten, zu erneuerbaren Energieträgern zu wechseln.

Wenn man digitale Dienste entwickelt und sieht, dass die Nutzer einen dazu auffordern, Ökostrom zu verwenden, halten wir es für einfacher, intern für diesen Wechsel zu argumentieren.

Das wollen wir also mit greenbeam erreichen.

### How do you want to implement your project technically?

Max. 1300 Zeichen

We will  extend an existing open source browser extension, called lightbeam, and add functionality using data from the Green Web Foundation. We will do this by either calling their API, or using open data they now publish.

(We will extend lightbeam with environmental data from the Green Web Foundation APIs )

In more detail:
*Make infrastructure visible*

Every time a browser loads a page, it makes multiple requests for images, code, and other such files from one or more servers. We intend to take the existing data visualisations that the existing lightbeam browser extension generates, and using colour encode information about how each site is powered.

*Highlight use*
We will also adapt the visualisations to encode more information, to help users understand which sites they use the most - with more used sites, showing as larger in the visualisation, and so on.

This helps users know who to ask first.

*Help users ask for change*
Finally we make it easier to highlight demand for renewable power, by sending a request for a ‘carbon.txt’ file on every site a user visits.

These requests show up in the usage data that people who run sites need to watch, to see how well their sites are performing.

Making this demand visible, makes it easier to argue show that  their users want them to switch to renewable power.


#### 

Wir planen, eine bestehende Open-Source-Browser-Erweiterung namens lightbeam zu erweitern und Funktionen basierend auf den Daten der Green Web Foundation hinzufügen. Wir möchten dazu entweder auf deren  API aufbauen oder die von ihnen angebotenen  offene Daten verwenden.

Wir planen, Lightbeam mit Umweltdaten aus der Green Web Foundation APIs zu  erweitern:

*Im Detail:*
Infrastruktur sichtbar machen

Jedes Mal, wenn ein Browser eine Seite lädt, sendet  er mehrere Anfragen um die Inhalte von einem oder mehreren Servern. Wir beabsichtigen, die bestehende Lightbeam Visualisierung zu übernehmen und farbkodierte Informationen darüber anzuzeigen, wie die Server mit Strom versorgt werden.

*Nutzung hervorheben*
Wir möchten die Visualisierung anpassen, um mehr Informationen zu integrieren. Dies soll dem Nutzer helfen, zu verstehen, welche Seiten er oder sie am meisten nutzt - häufiger genutzte Seiten, werden größer dargestellt, und so weiter.

Dies unterstützt  Anwender*innen darin, die wichtigsten Anbieter zuerst zu kontaktieren.

*Hilfestellungen um Betreiber zu überzeugen*
Wir machen wir es einfacher, die Nachfrage nach erneuerbarem Strom hervorzuheben, indem wir auf jeder Website, die ein Nutzer besucht, eine Anfrage nach einer "carbon.txt"-Datei senden.

Diese Anfragen werden in den Nutzungsdaten der Webseitenbetreiber angezeigt und  machen die Forderung nach erneuerbaren Energien sichtbar und ermuntern Betreiber auf erneuerbare Energien umzusteigen.

### What similar solutions exist already, and what will make your project different or better? * - done

Max. 400 Zeichen

Lightbeam makes it easier for users to understand how the web works, but is focussed on data privacy.

Ecograder shows some information about a site, but you need to look up every site you use manually. 

Greenbeam, like Lightbeam, is built into the browser, and passively creates environmental information as you browse the web.

#### Auf Deutsch

Lightbeam erleichtert den Nutzern das Verständnis der Funktionsweise des Webs, konzentriert sich aber auf Datenschutz.

Ecograder zeigt bereits Informationen über eine Website an, sie müssen allerdings manuell und einzeln für jede Webseite angefragt werden.

Greenbeam ist, wie Lightbeam, in den Browser integriert und erzeugt im Hintergrund Umweltinformationen, während man im Internet surft.


Who is the target group, and how will your tool reach them? * - DONE
Max. 400 Zeichen

The target group are people who care about the climate and care about the web, but don’t yet see clearly the connection between the two.

We envision Greenbeam as a consumer educational tool, we will partner up with existing campaigns and media coverage.

Examples include: 

the Mozilla Internet Health report, and Greenpeace’s own campaigns, a number of the green IT groups listed under the umbrella group “Green IT global”, and existing european wide groups like ICTfootprint.eu, along with conferences like Bits Und Baume, and countrywide sustainable IT groups like Nachhaltig Digital.

#### Auf Deutsch

Die Zielgruppe sind Menschen, denen das Klima und das Web wichtig sind, denen aber der Zusammenhang zwischen den Beiden noch nicht deutlich ist.

Wir sehen Greenbeam als ein Instrument zur Aufklärung von Verbrauchern, wir beabsichtigen Partnerschaften mit bestehenden Initiativen einzugehen und Berichterstattung in den Medien zu erreichen.

Beispiele sind unter Anderem:

Der Mozilla Internet Health Report, die Initiativen von Greenpeace, eine Reihe der unter dem Dach der Gruppe "Green IT global" aufgeführten Green IT-Gruppen und bestehende europaweite Gruppen wie ICTfootprint.eu, sowie Konferenzen wie Bits Und Bäume und bundesweite nachhaltige IT-Gruppen wie Nachhaltig Digital.


Have you already worked on the idea? If so, briefly describe the current status and explain the proposed changes. * - done

Max. 700 zeichen

Lightbeam is an existing project that was incubated by Mozilla, and during a previous prototype fund grant, developed further to work better in the Firefox browser, including new features. It is actively maintained.

The Green Web Foundation makes data about how websites are powered available as open data, using an earlier prototype fund grant, the code-base was open sourced, making it possible to understand how the data was created, and improve the methodology.

This combines ideas from the two projects to build that couldn’t be built before.
Auf Deutsch

Lightbeam ist ein bestehendes Projekt, dass von Mozilla ins Leben gerufen wurde und bei einem früheren Prototyp-Fondszuschuss weiterentwickelt wurde, um im Firefox-Browser besser zu funktionieren, einschließlich neuer Funktionen. Es wird aktiv gepflegt.

Die Green Web Foundation stellt Daten in einem offenen Format zur Verfügung, wie Websites betrieben werden. Ein früherer Prototyp eines Fondszuschusses wurde dazu verwendet die Codebasis als Open Source zu veröffentlichen. Dies ermöglicht, zu verstehen, wie die Daten erstellt wurden und die Methodik zu verbessern.

Mit Greenbeam werden Ideen aus den beiden Projekten in einer Art kombiniert, die bisher nicht realisierbar war.


### Link to the existing project (if available):
https://github.com/mrchrisadams/greenbeam/


#### How many hours do you want (or will the team) work on the implementation in the 6 months funding period
[full-time default is 960]

960
Briefly sketch the most important milestones which you (and the team) want to implement in the funding period. *
M1
The extension uses the existing lightbeam visualisations, and shows environmental data from the green web foundation APIs, to show which websites a user relies on regularly still use fossil fuels.
M2
The extension is able to send requests for a “carbon.txt” file to every site a user visits, in a similar way that search engine web crawlers request information to “robots.txt”.
M3
The extension updates the visualisation based on how much a user uses each website, so if a user wants to contact the people and ask them to switch, they have data to show which companies to contact first.


#### Auf Deutsch - (needs to be 700 chars)

M1
Die Erweiterung nutzt die vorhandenen lightbeam Visualisierungen und zeigt Umweltdaten aus den Green Web Foundation APIs an, um zu zeigen,welche Websites, die ein Nutzer regelmäßig verwendet, noch mit fossilen Brennstoffen betrieben werden..
M2
Die Erweiterung ist in der Lage, Anfragen nach einer "carbon.txt"-Datei an jede Website zu senden, die ein Benutzer besucht, ähnlich wie Suchmaschinen-Webcrawler Informationen aus "robots.txt" anfordern.
M3
Die Erweiterung aktualisiert die Visualisierung basierend darauf, wie viel ein Benutzer jede Website nutzt - haben sie Informationen dazu, welche Unternehmen zuerst kontaktiert werden sollten.


### If my project idea is not supported, can it be published on prototypefund.de and in scientific publications around the program nonetheless? (y/n) *
JA
