/* GS1 Composite Core 0.3.0 — add-on for GS1 / Barcode Reader v0.2.
 * No DOM, camera, server, paid SDK, or cross-frame payload cache.
 * Requires the existing zxing-wasm 3.1.3 reader for linear symbols.
 * CC-A/CC-B geometry and payload decoding are implemented below in JS.
 * Third-party attribution and exact source revisions: THIRD_PARTY_NOTICES.txt.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GS1CompositeCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // PDF417 patterns: ZXing-C++ (Apache-2.0); RAP/variant tables: Zint (BSD-3-Clause).
  const PDF_PATTERNS = [120256,125680,128380,120032,125560,128318,108736,119920,108640,86080,108592,86048,110016,120560,125820,109792,120440,125758,88256,109680,88160,89536,110320,120700,89312,110200,120638,89200,110140,89840,110460,89720,110398,89980,128506,119520,125304,128190,107712,119408,125244,107616,119352,84032,107568,119324,84000,107544,83984,108256,119672,125374,85184,108144,119612,85088,108088,119582,85040,108060,85728,108408,119742,85616,108348,85560,108318,85880,108478,85820,85790,107200,119152,125116,107104,119096,125086,83008,107056,119068,82976,107032,82960,82952,83648,107376,119228,83552,107320,119198,83504,107292,83480,83468,83824,107452,83768,107422,83740,83900,106848,118968,125022,82496,106800,118940,82464,106776,118926,82448,106764,82440,106758,82784,106936,119006,82736,106908,82712,106894,82700,82694,106974,82830,82240,106672,118876,82208,106648,118862,82192,106636,82184,106630,82180,82352,82328,82316,82080,118830,106572,106566,82050,117472,124280,127678,103616,117360,124220,103520,117304,124190,75840,103472,75808,104160,117624,124350,76992,104048,117564,76896,103992,76848,76824,77536,104312,117694,77424,104252,77368,77340,77688,104382,77628,77758,121536,126320,128700,121440,126264,128670,111680,121392,126236,111648,121368,126222,111632,121356,103104,117104,124092,112320,103008,117048,124062,112224,121656,126366,93248,74784,102936,117006,93216,112152,93200,75456,103280,117180,93888,75360,103224,117150,93792,112440,121758,93744,75288,93720,75632,103356,94064,75576,103326,94008,112542,93980,75708,94140,75678,94110,121184,126136,128606,111168,121136,126108,111136,121112,126094,111120,121100,111112,111108,102752,116920,123998,111456,102704,116892,91712,74272,121244,116878,91680,74256,102668,91664,111372,102662,74244,74592,102840,116958,92000,74544,102812,91952,111516,102798,91928,74508,74502,74680,102878,92088,74652,92060,74638,92046,92126,110912,121008,126044,110880,120984,126030,110864,120972,110856,120966,110852,110850,74048,102576,116828,90944,74016,102552,116814,90912,111000,121038,90896,73992,102534,90888,110982,90884,74160,102620,91056,74136,102606,91032,111054,91020,74118,91014,91100,91086,110752,120920,125998,110736,120908,110728,120902,110724,110722,73888,102488,116782,90528,73872,102476,90512,110796,102470,90504,73860,90500,73858,73944,90584,90572,90566,120876,120870,110658,102444,73800,90312,90308,90306,101056,116080,123580,100960,116024,70720,100912,115996,70688,100888,70672,70664,71360,101232,116156,71264,101176,116126,71216,101148,71192,71180,71536,101308,71480,101278,71452,71612,71582,118112,124600,127838,105024,118064,124572,104992,118040,124558,104976,118028,104968,118022,100704,115896,123486,105312,100656,115868,79424,70176,118172,115854,79392,105240,100620,79376,70152,79368,70496,100792,115934,79712,70448,118238,79664,105372,100750,79640,70412,79628,70584,100830,79800,70556,79772,70542,70622,79838,122176,126640,128860,122144,126616,128846,122128,126604,122120,126598,122116,104768,117936,124508,113472,104736,126684,124494,113440,122264,126670,113424,104712,117894,113416,122246,104706,69952,100528,115804,78656,69920,100504,115790,96064,78624,104856,117966,96032,113560,122318,100486,96016,78600,104838,96008,69890,70064,100572,78768,70040,100558,96176,78744,104910,96152,113614,70022,78726,70108,78812,70094,96220,78798,122016,126552,128814,122000,126540,121992,126534,121988,121986,104608,117848,124462,113056,104592,126574,113040,122060,117830,113032,104580,113028,104578,113026,69792,100440,115758,78240,69776,100428,95136,78224,104652,100422,95120,113100,69764,95112,78212,69762,78210,69848,100462,78296,69836,95192,78284,69830,95180,78278,69870,95214,121936,126508,121928,126502,121924,121922,104528,117804,112848,104520,117798,112840,121958,112836,104514,112834,69712,100396,78032,69704,100390,94672,78024,104550,94664,112870,69698,94660,78018,94658,78060,94700,94694,126486,121890,117782,104484,104482,69672,77928,94440,69666,77922,99680,68160,99632,68128,99608,115342,68112,99596,68104,99590,68448,99768,115422,68400,99740,68376,99726,68364,68358,68536,99806,68508,68494,68574,101696,116400,123740,101664,116376,101648,116364,101640,116358,101636,67904,99504,115292,72512,67872,116444,115278,72480,101784,116430,72464,67848,99462,72456,101766,67842,68016,99548,72624,67992,99534,72600,101838,72588,67974,68060,72668,68046,72654,118432,124760,127918,118416,124748,118408,124742,118404,118402,101536,116312,105888,101520,116300,105872,118476,116294,105864,101508,105860,101506,105858,67744,99416,72096,67728,116334,80800,72080,101580,99398,80784,105932,67716,80776,72068,67714,72066,67800,99438,72152,67788,80856,72140,67782,80844,72134,67822,72174,80878,126800,128940,126792,128934,126788,126786,118352,124716,122576,126828,124710,122568,126822,122564,118338,122562,101456,116268,105680,101448,116262,114128,105672,118374,114120,122598,101442,114116,105666,114114,67664,99372,71888,67656,99366,80336,71880,101478,97232,80328,105702,67650,97224,114150,71874,97220,67692,71916,67686,80364,71910,97260,80358,97254,126760,128918,126756,126754,118312,124694,122472,126774,122468,118306,122466,101416,116246,105576,101412,113896,105572,101410,113892,105570,113890,67624,99350,71784,101430,80104,71780,67618,96744,80100,71778,96740,80098,96738,71798,96758,126738,122420,122418,105524,113780,113778,71732,79988,96500,96498,66880,66848,98968,66832,66824,66820,66992,66968,66956,66950,67036,67022,100000,99984,115532,99976,115526,99972,99970,66720,98904,69024,100056,98892,69008,100044,69000,100038,68996,66690,68994,66776,98926,69080,100078,69068,66758,69062,66798,69102,116560,116552,116548,116546,99920,102096,116588,115494,102088,116582,102084,99906,102082,66640,68816,66632,98854,73168,68808,66628,73160,68804,66626,73156,68802,66668,68844,66662,73196,68838,73190,124840,124836,124834,116520,118632,124854,118628,116514,118626,99880,115478,101992,116534,106216,101988,99874,106212,101986,106210,66600,98838,68712,99894,72936,68708,66594,81384,72932,68706,81380,72930,66614,68726,72950,81398,128980,128978,124820,126900,124818,126898,116500,118580,116498,122740,118578,122738,99860,101940,99858,106100,101938,114420,128352,129720,125504,128304,129692,125472,128280,129678,125456,128268,125448,128262,125444,125792,128440,129758,120384,125744,128412,120352,125720,128398,120336,125708,120328,125702,120324,120672,125880,128478,110144,120624,125852,110112,120600,125838,110096,120588,110088,120582,110084,110432,120760,125918,89664,110384,120732,89632,110360,120718,89616,110348,89608,110342,89952,110520,120798,89904,110492,89880,110478,89868,90040,110558,90012,89998,125248,128176,129628,125216,128152,129614,125200,128140,125192,128134,125188,125186,119616,125360,128220,119584,125336,128206,119568,125324,119560,125318,119556,119554,108352,119728,125404,108320,119704,125390,108304,119692,108296,119686,108292,108290,85824,108464,119772,85792,108440,119758,85776,108428,85768,108422,85764,85936,108508,85912,108494,85900,85894,85980,85966,125088,128088,129582,125072,128076,125064,128070,125060,125058,119200,125144,128110,119184,125132,119176,125126,119172,119170,107424,119256,125166,107408,119244,107400,119238,107396,107394,83872,107480,119278,83856,107468,83848,107462,83844,83842,83928,107502,83916,83910,83950,125008,128044,125000,128038,124996,124994,118992,125036,118984,125030,118980,118978,106960,119020,106952,119014,106948,106946,82896,106988,82888,106982,82884,82882,82924,82918,124968,128022,124964,124962,118888,124982,118884,118882,106728,118902,106724,106722,82408,106742,82404,82402,124948,124946,118836,118834,106612,106610,124224,127664,129372,124192,127640,129358,124176,127628,124168,127622,124164,124162,117568,124336,127708,117536,124312,127694,117520,124300,117512,124294,117508,117506,104256,117680,124380,104224,117656,124366,104208,117644,104200,117638,104196,104194,77632,104368,117724,77600,104344,117710,77584,104332,77576,104326,77572,77744,104412,77720,104398,77708,77702,77788,77774,128672,129880,93168,128656,129868,92664,128648,129862,92412,128644,128642,124064,127576,129326,126368,124048,129902,126352,128716,127558,126344,124036,126340,124034,126338,117152,124120,127598,121760,117136,124108,121744,126412,124102,121736,117124,121732,117122,121730,103328,117208,124142,112544,103312,117196,112528,121804,117190,112520,103300,112516,103298,112514,75680,103384,117230,94112,75664,103372,94096,112588,103366,94088,75652,94084,75650,75736,103406,94168,75724,94156,75718,94150,75758,128592,129836,91640,128584,129830,91388,128580,91262,128578,123984,127532,126160,123976,127526,126152,128614,126148,123970,126146,116944,124012,121296,116936,124006,121288,126182,121284,116930,121282,102864,116972,111568,102856,116966,111560,121318,111556,102850,111554,74704,102892,92112,74696,102886,92104,111590,92100,74690,92098,74732,92140,74726,92134,128552,129814,90876,128548,90750,128546,123944,127510,126056,128566,126052,123938,126050,116840,123958,121064,116836,121060,116834,121058,102632,116854,111080,121078,111076,102626,111074,74216,102646,91112,74212,91108,74210,91106,74230,91126,128532,90494,128530,123924,126004,123922,126002,116788,120948,116786,120946,102516,110836,102514,110834,73972,90612,73970,90610,128522,123914,125978,116762,120890,102458,110714,123552,127320,129198,123536,127308,123528,127302,123524,123522,116128,123608,127342,116112,123596,116104,123590,116100,116098,101280,116184,123630,101264,116172,101256,116166,101252,101250,71584,101336,116206,71568,101324,71560,101318,71556,71554,71640,101358,71628,71622,71662,127824,129452,79352,127816,129446,79100,127812,78974,127810,123472,127276,124624,123464,127270,124616,127846,124612,123458,124610,115920,123500,118224,115912,123494,118216,124646,118212,115906,118210,100816,115948,105424,100808,115942,105416,118246,105412,100802,105410,70608,100844,79824,70600,100838,79816,105446,79812,70594,79810,70636,79852,70630,79846,129960,95728,113404,129956,95480,113278,129954,95356,95294,127784,129430,78588,128872,129974,95996,78462,128868,127778,95870,128866,123432,127254,124520,123428,126696,128886,123426,126692,124514,126690,115816,123446,117992,115812,122344,117988,115810,122340,117986,122338,100584,115830,104936,100580,113640,104932,100578,113636,104930,113634,70120,100598,78824,70116,96232,78820,70114,96228,78818,96226,70134,78838,129940,94968,113022,129938,94844,94782,127764,78206,128820,127762,95102,128818,123412,124468,123410,126580,124466,126578,115764,117876,115762,122100,117874,122098,100468,104692,100466,113140,104690,113138,69876,78324,69874,95220,78322,95218,129930,94588,94526,127754,128794,123402,124442,126522,115738,117818,121978,100410,104570,112890,69754,78074,94714,94398,123216,127148,123208,127142,123204,123202,115408,123244,115400,123238,115396,115394,99792,115436,99784,115430,99780,99778,68560,99820,68552,99814,68548,68546,68588,68582,127400,129238,72444,127396,72318,127394,123176,127126,123752,123172,123748,123170,123746,115304,123190,116456,115300,116452,115298,116450,99560,115318,101864,99556,101860,99554,101858,68072,99574,72680,68068,72676,68066,72674,68086,72694,129492,80632,105854,129490,80508,80446,127380,72062,127924,127378,80766,127922,123156,123700,123154,124788,123698,124786,115252,116340,115250,118516,116338,118514,99444,101620,99442,105972,101618,105970,67828,72180,67826,80884,72178,80882,97008,114044,96888,113982,96828,96798,129482,80252,130010,97148,80190,97086,127370,127898,128954,123146,123674,124730,126842,115226,116282,118394,122618,99386,101498,105722,114170,67706,71930,80378,96632,113854,96572,96542,80062,96702,96444,96414,96350,123048,123044,123042,115048,123062,115044,115042,99048,115062,99044,99042,67048,99062,67044,67042,67062,127188,68990,127186,123028,123316,123026,123314,114996,115572,114994,115570,98932,100084,98930,100082,66804,69108,66802,69106,129258,73084,73022,127178,127450,123018,123290,123834,114970,115514,116602,98874,99962,102138,66682,68858,73210,81272,106174,81212,81182,72894,81342,97648,114364,97592,114334,97564,97550,81084,97724,81054,97694,97464,114270,97436,97422,80990,97502,97372,97358,97326,114868,114866,98676,98674,66292,66290,123098,114842,115130,98618,99194,66170,67322,69310,73404,73374,81592,106334,81564,81550,73310,81630,97968,114524,97944,114510,97932,97926,81500,98012,81486,97998,97880,114478,97868,97862,81454,97902,97836,97830,69470,73564,73550,81752,106414,81740,81734,73518,81774,81708,81702,109536,120312,86976,109040,120060,86496,108792,119934,86256,108668,86136,129744,89056,110072,129736,88560,109820,129732,88312,109694,129730,88188,128464,129772,89592,128456,129766,89340,128452,89214,128450,125904,128492,125896,128486,125892,125890,120784,125932,120776,125926,120772,120770,110544,120812,110536,120806,110532,84928,108016,119548,84448,107768,119422,84208,107644,84088,107582,84028,129640,85488,108284,129636,85240,108158,129634,85116,85054,128232,129654,85756,128228,85630,128226,125416,128246,125412,125410,119784,125430,119780,119778,108520,119798,108516,108514,83424,107256,119166,83184,107132,83064,107070,83004,82974,129588,83704,107390,129586,83580,83518,128116,83838,128114,125172,125170,119284,119282,107508,107506,82672,106876,82552,106814,82492,82462,129562,82812,82750,128058,125050,119034,82296,106686,82236,82206,82366,82108,82078,76736,103920,117500,76256,103672,117374,76016,103548,75896,103486,75836,129384,77296,104188,129380,77048,104062,129378,76924,76862,127720,129398,77564,127716,77438,127714,124392,127734,124388,124386,117736,124406,117732,117730,104424,117750,104420,104418,112096,121592,126334,92608,111856,121468,92384,111736,121406,92272,111676,92216,111646,92188,75232,103160,117118,93664,74992,103036,93424,112252,102974,93304,74812,93244,74782,93214,129332,75512,103294,129908,129330,93944,75388,129906,93820,75326,93758,127604,75646,128756,127602,94078,128754,124148,126452,124146,126450,117236,121844,117234,121842,103412,103410,91584,111344,121212,91360,111224,121150,91248,111164,91192,111134,91164,91150,74480,102780,91888,74360,102718,91768,111422,91708,74270,91678,129306,74620,129850,92028,74558,91966,127546,128634,124026,126202,116986,121338,102906,90848,110968,121022,90736,110908,90680,110878,90652,90638,74104,102590,91000,74044,90940,74014,90910,74174,91070,90480,110780,90424,110750,90396,90382,73916,90556,73886,90526,90296,110686,90268,90254,73822,90334,90204,90190,71136,101112,116094,70896,100988,70776,100926,70716,70686,129204,71416,101246,129202,71292,71230,127348,71550,127346,123636,123634,116212,116210,101364,101362,79296,105200,118140,79072,105080,118078,78960,105020,78904,104990,78876,78862,70384,100732,79600,70264,100670,79480,105278,79420,70174,79390,129178,70524,129466,79740,70462,79678,127290,127866,123514,124666,115962,118266,100858,113376,122232,126654,95424,113264,122172,95328,113208,122142,95280,113180,95256,113166,95244,78560,104824,117950,95968,78448,104764,95856,113468,104734,95800,78364,95772,78350,95758,70008,100542,78712,69948,96120,78652,69918,96060,78622,96030,70078,78782,96190,94912,113008,122044,94816,112952,122014,94768,112924,94744,112910,94732,94726,78192,104636,95088,78136,104606,95032,113054,95004,78094,94990,69820,78268,69790,95164,78238,95134,94560,112824,121950,94512,112796,94488,112782,94476,94470,78008,104542,94648,77980,94620,77966,94606,69726,78046,94686,94384,112732,94360,112718,94348,94342,77916,94428,77902,94414,94296,112686,94284,94278,77870,94318,94252,94246,68336,99708,68216,99646,68156,68126,68476,68414,127162,123258,115450,99834,72416,101752,116414,72304,101692,72248,101662,72220,72206,67960,99518,72568,67900,72508,67870,72478,68030,72638,80576,105840,118460,80480,105784,118430,80432,105756,80408,105742,80396,80390,72048,101564,80752,71992,101534,80696,71964,80668,71950,80654,67772,72124,67742,80828,72094,80798,114016,122552,126814,96832,113968,122524,96800,113944,122510,96784,113932,96776,113926,96772,80224,105656,118366,97120,80176,105628,97072,114076,105614,97048,80140,97036,80134,97030,71864,101470,80312,71836,97208,80284,71822,97180,80270,97166,67678,71902,80350,97246,96576,113840,122460,96544,113816,122446,96528,113804,96520,113798,96516,96514,80048,105564,96688,80024,105550,96664,113870,96652,80006,96646,71772,80092,71758,96732,80078,96718,96416,113752,122414,96400,113740,96392,113734,96388,96386,79960,105518,96472,79948,96460,79942,96454,71726,79982,96494,96336,113708,96328,113702,96324,96322,79916,96364,79910,96358,96296,113686,96292,96290,79894,96310,66936,99006,66876,66846,67006,68976,100028,68920,99998,68892,68878,66748,69052,66718,69022,73056,102072,116574,73008,102044,72984,102030,72972,72966,68792,99934,73144,68764,73116,68750,73102,66654,68830,73182,81216,106160,118620,81184,106136,118606,81168,106124,81160,106118,81156,81154,72880,101980,81328,72856,101966,81304,106190,81292,72838,81286,68700,72924,68686,81372,72910,81358,114336,122712,126894,114320,122700,114312,122694,114308,114306,81056,106072,118574,97696,81040,106060,97680,114380,106054,97672,81028,97668,81026,97666,72792,101934,81112,72780,97752,81100,72774,97740,81094,97734,68654,72814,81134,97774,114256,122668,114248,122662,114244,114242,80976,106028,97488,80968,106022,97480,114278,97476,80962,97474,72748,81004,72742,97516,80998,97510,114216,122646,114212,114210,80936,106006,97384,80932,97380,80930,97378,72726,80950,97398,114196,114194,80916,97332,80914,97330,66236,66206,67256,99166,67228,67214,66142,67294,69296,100188,69272,100174,69260,69254,67164,69340,67150,69326,73376,102232,116654,73360,102220,73352,102214,73348,73346,69208,100142,73432,102254,73420,69190,73414,67118,69230,73454,106320,118700,106312,118694,106308,106306,73296,102188,81616,106348,102182,81608,73284,81604,73282,81602,69164,73324,69158,81644,73318,81638,122792,126934,122788,122786,106280,118678,114536,106276,114532,106274,114530,73256,102166,81512,73252,98024,81508,73250,98020,81506,98018,69142,73270,81526,98038,122772,122770,106260,114484,106258,114482,73236,81460,73234,97908,81458,97906,122762,106250,114458,73226,81434,97850,66396,66382,67416,99246,67404,67398,66350,67438,69456,100268,69448,100262,69444,69442,67372,69484,67366,69478,102312,116694,102308,102306,69416,100246,73576,102326,73572,69410,73570,67350,69430,73590,118740,118738,102292,106420,102290,106418,69396,73524,69394,81780,73522,81778,118730,102282,106394,69386,73498,81722,66476,66470,67496,99286,67492,67490,66454,67510,100308,100306,67476,69556,67474,69554,116714];
  const SIDE_RAP = [802, 930, 946, 818, 882, 890, 826, 954, 922, 986, 970, 906, 778, 794, 786, 914, 978, 982, 980, 916, 948, 932, 934, 942, 940, 936, 808, 812, 814, 806, 822, 950, 918, 790, 788, 820, 884, 868, 870, 878, 876, 872, 840, 856, 860, 862, 846, 844, 836, 838, 834, 866];
  const CENTER_RAP = [718, 590, 622, 558, 550, 566, 534, 530, 538, 570, 562, 546, 610, 626, 634, 762, 754, 758, 630, 628, 612, 614, 582, 578, 706, 738, 742, 740, 748, 620, 556, 552, 616, 744, 712, 716, 708, 710, 646, 654, 652, 668, 664, 696, 688, 656, 720, 592, 600, 604, 732, 734];
  const VARIANTS = [{"kind":"CC-A","cols":2,"rows":5,"ecc":4,"left":39,"center":0,"right":19,"cluster":2,"bits":59,"layout":"2"},{"kind":"CC-A","cols":2,"rows":6,"ecc":4,"left":1,"center":0,"right":33,"cluster":0,"bits":78,"layout":"2"},{"kind":"CC-A","cols":2,"rows":7,"ecc":5,"left":32,"center":0,"right":12,"cluster":1,"bits":88,"layout":"2"},{"kind":"CC-A","cols":2,"rows":8,"ecc":5,"left":8,"center":0,"right":40,"cluster":1,"bits":108,"layout":"2"},{"kind":"CC-A","cols":2,"rows":9,"ecc":6,"left":14,"center":0,"right":46,"cluster":1,"bits":118,"layout":"2"},{"kind":"CC-A","cols":2,"rows":10,"ecc":6,"left":43,"center":0,"right":23,"cluster":0,"bits":138,"layout":"2"},{"kind":"CC-A","cols":2,"rows":12,"ecc":7,"left":20,"center":0,"right":52,"cluster":1,"bits":167,"layout":"2"},{"kind":"CC-A","cols":3,"rows":4,"ecc":4,"left":11,"center":43,"right":23,"cluster":1,"bits":78,"layout":"A3"},{"kind":"CC-A","cols":3,"rows":5,"ecc":5,"left":1,"center":33,"right":13,"cluster":0,"bits":98,"layout":"A3"},{"kind":"CC-A","cols":3,"rows":6,"ecc":6,"left":5,"center":37,"right":17,"cluster":1,"bits":118,"layout":"A3"},{"kind":"CC-A","cols":3,"rows":7,"ecc":7,"left":15,"center":47,"right":27,"cluster":2,"bits":138,"layout":"A3"},{"kind":"CC-A","cols":3,"rows":8,"ecc":7,"left":21,"center":1,"right":33,"cluster":2,"bits":167,"layout":"A3"},{"kind":"CC-A","cols":4,"rows":3,"ecc":4,"left":40,"center":20,"right":52,"cluster":0,"bits":78,"layout":"4"},{"kind":"CC-A","cols":4,"rows":4,"ecc":5,"left":43,"center":23,"right":3,"cluster":0,"bits":108,"layout":"4"},{"kind":"CC-A","cols":4,"rows":5,"ecc":6,"left":46,"center":26,"right":6,"cluster":0,"bits":138,"layout":"4"},{"kind":"CC-A","cols":4,"rows":6,"ecc":7,"left":34,"center":14,"right":46,"cluster":0,"bits":167,"layout":"4"},{"kind":"CC-A","cols":4,"rows":7,"ecc":8,"left":29,"center":9,"right":41,"cluster":1,"bits":197,"layout":"4"},{"kind":"CC-B","cols":2,"rows":8,"ecc":8,"left":1,"center":0,"right":1,"cluster":0,"layout":"2"},{"kind":"CC-B","cols":2,"rows":11,"ecc":9,"left":1,"center":0,"right":9,"cluster":0,"layout":"2"},{"kind":"CC-B","cols":2,"rows":14,"ecc":9,"left":8,"center":0,"right":8,"cluster":1,"layout":"2"},{"kind":"CC-B","cols":2,"rows":17,"ecc":10,"left":36,"center":0,"right":36,"cluster":2,"layout":"2"},{"kind":"CC-B","cols":2,"rows":20,"ecc":11,"left":19,"center":0,"right":19,"cluster":0,"layout":"2"},{"kind":"CC-B","cols":2,"rows":23,"ecc":13,"left":9,"center":0,"right":17,"cluster":2,"layout":"2"},{"kind":"CC-B","cols":2,"rows":26,"ecc":15,"left":27,"center":0,"right":35,"cluster":2,"layout":"2"},{"kind":"CC-B","cols":3,"rows":6,"ecc":12,"left":1,"center":1,"right":1,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":8,"ecc":14,"left":7,"center":7,"right":7,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":10,"ecc":16,"left":15,"center":15,"right":15,"cluster":2,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":12,"ecc":18,"left":25,"center":25,"right":25,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":15,"ecc":21,"left":37,"center":37,"right":37,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":20,"ecc":26,"left":1,"center":17,"right":33,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":26,"ecc":32,"left":1,"center":9,"right":17,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":32,"ecc":38,"left":21,"center":29,"right":37,"cluster":2,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":38,"ecc":44,"left":15,"center":31,"right":47,"cluster":2,"layout":"B3"},{"kind":"CC-B","cols":3,"rows":44,"ecc":50,"left":1,"center":25,"right":49,"cluster":0,"layout":"B3"},{"kind":"CC-B","cols":4,"rows":4,"ecc":8,"left":47,"center":19,"right":43,"cluster":1,"layout":"4"},{"kind":"CC-B","cols":4,"rows":6,"ecc":12,"left":1,"center":1,"right":1,"cluster":0,"layout":"4"},{"kind":"CC-B","cols":4,"rows":8,"ecc":14,"left":7,"center":7,"right":7,"cluster":0,"layout":"4"},{"kind":"CC-B","cols":4,"rows":10,"ecc":16,"left":15,"center":15,"right":15,"cluster":2,"layout":"4"},{"kind":"CC-B","cols":4,"rows":12,"ecc":18,"left":25,"center":25,"right":25,"cluster":0,"layout":"4"},{"kind":"CC-B","cols":4,"rows":15,"ecc":21,"left":37,"center":37,"right":37,"cluster":0,"layout":"4"},{"kind":"CC-B","cols":4,"rows":20,"ecc":26,"left":1,"center":17,"right":33,"cluster":0,"layout":"4"},{"kind":"CC-B","cols":4,"rows":26,"ecc":32,"left":1,"center":9,"right":17,"cluster":0,"layout":"4"},{"kind":"CC-B","cols":4,"rows":32,"ecc":38,"left":21,"center":29,"right":37,"cluster":2,"layout":"4"},{"kind":"CC-B","cols":4,"rows":38,"ecc":44,"left":15,"center":31,"right":47,"cluster":2,"layout":"4"},{"kind":"CC-B","cols":4,"rows":44,"ecc":50,"left":1,"center":25,"right":49,"cluster":0,"layout":"4"}];

  const GS = '\x1d';
  const DEFAULT_FORMATS = [
    'DataBar','DataBarOmni','DataBarStk','DataBarStkOmni','DataBarLtd','DataBarExp','DataBarExpStk',
    'EAN13','EAN8','UPCA','UPCE','Code128','ITF','ITF14','DataMatrix','MicroPDF417','PDF417'
  ];
  let nextFrameId = 0;
  const fail = () => { throw new Error('Invalid/unsupported Composite component'); };
  const mod = n => ((n % 929) + 929) % 929;
  const EXP = new Int32Array(928), LOG = new Int32Array(929);
  for (let i=0, x=1;i<928;i++,x=x*3%929) { EXP[i]=x; LOG[x]=i; }
  const inverse = x => { if (!x) fail(); return EXP[(928-LOG[x])%928]; };
  const polyAt = (p,x) => { let y=0; for (let i=p.length-1;i>=0;i--) y=mod(y*x+p[i]); return y; };

  // Reed–Solomon over GF(929), generator 3, first root 3^1.
  // Erasures + Berlekamp–Massey, then solve magnitudes and recheck ALL syndromes.
  // Leave two parity symbols unused as a conservative miscorrection margin.
  function correctCodewords(input, ecc) {
    const cw = input.map(x => x < 0 ? 0 : x), erasures=[];
    input.forEach((x,i) => { if (x < 0) erasures.push(i); });
    if (cw.some(x => !Number.isInteger(x) || x<0 || x>928) || erasures.length>ecc-2) return null;
    const syndromes = data => Array.from({length:ecc},(_,j) => {
      let s=0; for (const c of data) s=mod(s*EXP[j+1]+c); return s;
    });
    const syn=syndromes(cw);
    if (syn.every(x => x===0) && !erasures.length) return {codewords:cw, corrected:0, erasures:0};
    let f=syn.slice();
    for (const pos of erasures) {
      const x=EXP[cw.length-1-pos];
      f=f.slice(1).map((v,i) => mod(v-x*f[i]));
    }
    let C=[1], B=[1], L=0, m=1, b=1;
    for (let n=0;n<f.length;n++) {
      let d=f[n]; for (let i=1;i<=L;i++) d=mod(d+(C[i]||0)*f[n-i]);
      if (!d) { m++; continue; }
      const old=C.slice(), coef=mod(d*inverse(b));
      while (C.length < B.length+m) C.push(0);
      for (let i=0;i<B.length;i++) C[i+m]=mod(C[i+m]-coef*B[i]);
      if (2*L<=n) { L=n+1-L; B=old; b=d; m=1; } else m++;
    }
    if (2*L+erasures.length>ecc-2) return null;
    const errors=[];
    for (let i=0;i<cw.length;i++) {
      const x=EXP[cw.length-1-i];
      if (polyAt(C,inverse(x))===0) errors.push(i);
    }
    if (errors.length!==L || errors.some(i => erasures.includes(i))) return null;
    const positions=erasures.concat(errors), n=positions.length;
    if (!n) return null;
    const matrix=Array.from({length:n},(_,r) => positions.map(pos => EXP[((cw.length-1-pos)*(r+1))%928]).concat(syn[r]));
    for (let col=0;col<n;col++) {
      let p=col; while(p<n && !matrix[p][col]) p++;
      if(p===n) return null;
      [matrix[p],matrix[col]]=[matrix[col],matrix[p]];
      const inv=inverse(matrix[col][col]);
      for(let j=col;j<=n;j++) matrix[col][j]=mod(matrix[col][j]*inv);
      for(let r=0;r<n;r++) if(r!==col) {
        const a=matrix[r][col];
        for(let j=col;j<=n;j++) matrix[r][j]=mod(matrix[r][j]-a*matrix[col][j]);
      }
    }
    positions.forEach((pos,i) => { cw[pos]=mod(cw[pos]-matrix[i][n]); });
    if(!syndromes(cw).every(x => x===0)) return null;
    return {codewords:cw,corrected:errors.length,erasures:erasures.length};
  }

  class Bits {
    constructor(s) { this.s=s; this.i=0; }
    get size() { return this.s.length-this.i; }
    peek(n) { if(n<0 || n>this.size) fail(); return n ? parseInt(this.s.slice(this.i,this.i+n),2) : 0; }
    read(n) { const v=this.peek(n); this.i+=n; return v; }
  }

  // General-purpose compaction follows ZXing ODDataBarExpandedBitDecoder.cpp.
  // Composite method headers are NOT DataBar Expanded method headers.
  function decodeGeneral(bits) {
    let state=0, out=''; // numeric / alpha / ISO 646
    while(bits.size) {
      if(state===0) {
        if(bits.size<4) { if(bits.read(bits.size)!==0) fail(); break; }
        if(bits.size<7) {
          const v=bits.read(4);
          if(v>10) fail();
          if(v) out+=String(v-1);
          if(bits.read(bits.size)!==0) fail();
          break;
        }
        if(bits.peek(4)===0) { bits.read(4); state=1; continue; }
        const v=bits.read(7)-8;
        if(v<0 || v>119) fail();
        for(const d of [Math.floor(v/11),v%11]) out+=d===10?GS:String(d);
      } else {
        if(bits.size<5) {
          const n=bits.size;
          if(bits.read(n)!==parseInt('00100'.slice(0,n),2)) fail();
          break;
        }
        if(bits.peek(3)===0) { bits.read(3); state=0; continue; }
        const v=bits.peek(5);
        if(v===4) { bits.read(5); state=state===1?2:1; }
        else if(v===15) { bits.read(5); out+=GS; state=0; }
        else if(v>=5 && v<=14) { bits.read(5); out+=String(v-5); }
        else if(state===1) {
          const w=bits.read(6);
          if(w>=32 && w<=57) out+=String.fromCharCode(w+33);
          else if(w>=58 && w<=62) out+='*,-./'[w-58];
          else fail();
        } else if(v>=16 && v<=28) {
          const w=bits.read(7);
          if(w>=64 && w<=89) out+=String.fromCharCode(w+1);
          else if(w>=90 && w<=115) out+=String.fromCharCode(w+7);
          else fail();
        } else {
          const w=bits.read(8);
          if(w<232 || w>252) fail();
          out+='!"%&\'()*+,-./:;<=>?_ '[w-232];
        }
      }
    }
    return out.replace(/\x1d+$/,'');
  }

  function decodeCompositeBits(binary) {
    const b=new Bits(binary);
    if(b.read(1)===0) return decodeGeneral(b);
    if(b.read(1)!==0) fail(); // AI90 method 11 is deliberately unsupported.
    let date='';
    if(b.peek(2)===3) b.read(2); // no date, implicit AI10
    else {
      const v=b.read(16); if(v>=38400) fail();
      const raw=String(Math.floor(v/384)).padStart(2,'0')+String(Math.floor(v/32)%12+1).padStart(2,'0')+String(v%32).padStart(2,'0');
      date=(b.read(1)?'17':'11')+raw;
    }
    const general=decodeGeneral(b);
    return date+(general.startsWith(GS)?general.slice(1):general?'10'+general:'');
  }

  function payloadBits(cw, variant) {
    if(variant.kind==='CC-A') {
      let binary='', at=0;
      for(let remaining=variant.bits;remaining>0;remaining-=69) {
        const n=Math.min(69,remaining), count=Math.floor(n/10)+1;
        let value=0n;
        for(let j=0;j<count;j++) { const c=cw[at++]; if(c==null || c>=928) fail(); value=value*928n+BigInt(c); }
        const s=value.toString(2); if(s.length>n) fail(); binary+=s.padStart(n,'0');
      }
      if(at!==cw.length) fail();
      return binary;
    }
    if(cw[0]!==920 || ![901,924].includes(cw[1])) fail();
    const mode=cw[1], data=cw.slice(2);
    if(!data.length || data.some(v => v>=900)) fail();
    const groups=mode===924?data.length/5:Math.floor((data.length-1)/5);
    if(!Number.isInteger(groups)) fail();
    const bytes=[];
    for(let g=0;g<groups;g++) {
      let value=0n; for(let j=0;j<5;j++) value=value*900n+BigInt(data[g*5+j]);
      if(value>=1n<<48n) fail();
      const group=Array(6); for(let j=5;j>=0;j--) {group[j]=Number(value&255n);value>>=8n;} bytes.push(...group);
    }
    for(const v of data.slice(groups*5)) { if(v>255) fail(); bytes.push(v); }
    return bytes.map(v => v.toString(2).padStart(8,'0')).join('');
  }

  // Small, strict field extractor for this task, not a general GS1 AI parser.
  function parseFields(text) {
    const s=String(text||'').replace(/^\][A-Za-z0-9][0-9]/,'').replace(/<GS>/gi,GS);
    const lengths={'01':14,'11':6,'13':6,'15':6,'16':6,'17':6,'20':2};
    const fields={}; Object.defineProperty(fields,'_order',{value:[]}); let i=0;
    while(i<s.length) {
      if(s[i]===GS) {i++;continue;}
      const hri=s[i]==='(';
      const ai=hri?s.slice(i+1,i+3):s.slice(i,i+2);
      if(hri && s[i+3]!==')') return null;
      if(fields[ai]!==undefined || !(ai in lengths || ai==='10' || ai==='21')) return null;
      i+=hri?4:2;
      let value;
      if(ai in lengths) { value=s.slice(i,i+lengths[ai]); i+=lengths[ai]; if(!/^\d+$/.test(value)||value.length!==lengths[ai]) return null; }
      else {
        let end=hri?s.indexOf('(',i):s.indexOf(GS,i); if(end<0) end=s.length;
        value=s.slice(i,end); i=end;
        if(value.length<1||value.length>20||!/^[\x20-\x7e]+$/.test(value)) return null;
      }
      if(['11','13','15','16','17'].includes(ai)) {
        const month=Number(value.slice(2,4)),day=Number(value.slice(4));
        if(month<1||month>12||day>new Date(Date.UTC(2000+Number(value.slice(0,2)),month,0)).getUTCDate()) return null;
      }
      fields[ai]=value;
      fields._order.push(ai);
    }
    return fields;
  }
  const hri = fields => (fields._order||Object.keys(fields)).map(k => '('+k+')'+fields[k]).join('');
  function validGTIN(s) {
    if(!/^\d{14}$/.test(s||'')) return false;
    let sum=0; for(let i=0;i<13;i++) sum+=Number(s[i])*(i%2?1:3);
    return (10-sum%10)%10===Number(s[13]);
  }

  const pointNames=['topLeft','topRight','bottomRight','bottomLeft'];
  function corners(position) {
    if(!position) return null;
    const p=position.cornerPoints||position;
    let pts=Array.isArray(p)?p:pointNames.map(n => p[n]);
    if(!pts.every(Boolean) && ['x','y','width','height'].every(k => Number.isFinite(position[k]))) {
      const {x,y,width:w,height:h}=position; pts=[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];
    }
    return pts.length===4 && pts.every(p => p && Number.isFinite(p.x)&&Number.isFinite(p.y))?pts:null;
  }
  function boundingBox(p) {
    if(!p) return null;
    const x=Math.min(...p.map(q=>q.x)),y=Math.min(...p.map(q=>q.y));
    return {x,y,width:Math.max(...p.map(q=>q.x))-x,height:Math.max(...p.map(q=>q.y))-y};
  }
  function axes(p) {
    if(!p) return null;
    const dx=p[1].x+p[2].x-p[0].x-p[3].x,dy=p[1].y+p[2].y-p[0].y-p[3].y;
    const length=Math.hypot(dx,dy); if(length<2) return null;
    const u={x:dx/length,y:dy/length},v={x:-dy/length,y:dx/length};
    const project=q=>({x:(q.x-p[0].x)*u.x+(q.y-p[0].y)*u.y,y:(q.x-p[0].x)*v.x+(q.y-p[0].y)*v.y});
    const b=boundingBox(p.map(project));
    return {u,v,project,width:b.width,top:b.y,bottom:b.y+b.height,
      world:(x,y)=>({x:p[0].x+x*u.x+y*v.x,y:p[0].y+x*u.y+y*v.y})};
  }

  // Only verified CC payloads may enter this matcher. Never pair arbitrary PDF417 text.
  // Both arrays must originate from ONE frame and ONE pixel coordinate system.
  function matchCompositeComponents(linears, components) {
    const candidates=[];
    for(let li=0;li<linears.length;li++) {
      const l=linears[li],lp=corners(l.cornerPoints||l.position),a=axes(lp);
      if(!a || a.width<12 || l.frameId==null || !/^DataBar/.test(l.format||'')) continue;
      for(let ci=0;ci<components.length;ci++) {
        const c=components[ci],cp=corners(c.cornerPoints||c.position),ca=axes(cp);
        if(!c.verified || !['CC-A','CC-B'].includes(c.kind) || c.frameId!==l.frameId || !ca) continue;
        if(a.u.x*ca.u.x+a.u.y*ca.u.y<Math.cos(12*Math.PI/180)) continue;
        if(c.gtin && c.gtin!==l.gtin) continue;
        if((l.lot && c.lot && l.lot!==c.lot)||(l.expiryRaw && c.expiryRaw && l.expiryRaw!==c.expiryRaw)) continue;
        const b=boundingBox(cp.map(a.project)),w=a.width,cw=b.width;
        const overlap=Math.max(0,Math.min(w,b.x+cw)-Math.max(0,b.x));
        const overlapRatio=overlap/Math.min(w,cw), gap=a.top-(b.y+b.height);
        const centerError=Math.abs(b.x+cw/2-w/2)/w;
        // A corner crossing into the lower code, excessive distance, or poor alignment is rejected.
        if(cw/w<0.24 || cw/w>1.50 || overlapRatio<0.86 || centerError>0.35 || gap< -0.018*w || gap>0.20*w) continue;
        if(b.y+b.height/2>=a.top) continue;
        const score=3*overlapRatio-2*Math.max(0,gap)/w-centerError;
        candidates.push({linearIndex:li,componentIndex:ci,score,overlap:overlapRatio,gap});
      }
    }
    // Mutual best match, one to one. Near ties on EITHER side remain unmatched.
    const unambiguous=(list,item) => {
      list.sort((a,b)=>b.score-a.score);
      return list[0]===item && (list.length===1 || list[0].score-list[1].score>=0.30);
    };
    return candidates.filter(c =>
      unambiguous(candidates.filter(x=>x.linearIndex===c.linearIndex),c) &&
      unambiguous(candidates.filter(x=>x.componentIndex===c.componentIndex),c));
  }

  const CW_MAP=new Map(PDF_PATTERNS.map((pattern,i)=>[pattern,{value:i%929,cluster:Math.floor(i/929)}]));
  function runsOfBits(value,n) {
    const runs=[];let previous=1,count=0;
    for(let bit=n-1;bit>=0;bit--) { const v=(value>>bit)&1; if(v===previous) count++; else {runs.push(count);count=1;previous=v;} }
    runs.push(count);return runs;
  }
  const SIDE_RUNS=SIDE_RAP.map(p=>runsOfBits(p,10)),CENTER_RUNS=CENTER_RAP.map(p=>runsOfBits(p,10));
  const LAYOUTS=[
    {id:'2',left:0,center:null,right:22,cws:[6,14],runs:29,width:55},
    {id:'A3',left:null,center:8,right:30,cws:[0,14,22],runs:37,width:72},
    {id:'B3',left:0,center:14,right:36,cws:[6,20,28],runs:43,width:82},
    {id:'4',left:0,center:22,right:44,cws:[6,14,28,36],runs:51,width:99}
  ];
  const signatures=new Map();
  VARIANTS.forEach((v,vi)=>{
    for(let row=0;row<v.rows;row++) {
      const advance=x=>x?(x-1+row)%52+1:0;
      const key=[v.layout,v.layout==='A3'?0:advance(v.left),advance(v.center),advance(v.right)].join(':');
      if(!signatures.has(key)) signatures.set(key,[]);
      signatures.get(key).push({vi,row,cluster:(v.cluster+row)%3});
    }
  });
  function readRAP(runs,start,center) {
    const table=center?CENTER_RUNS:SIDE_RUNS;
    let total=0;for(let i=0;i<6;i++) total+=runs[start+i]||0;
    if(total<8) return null;
    const ms=total/10;
    let best=Infinity,second=Infinity,index=-1;
    for(let k=0;k<52;k++) {
      let error=0;for(let i=0;i<6;i++) error+=(runs[start+i]/ms-table[k][i])**2;
      if(error<best){second=best;best=error;index=k;}else if(error<second) second=error;
    }
    return best<1.0 && second-best>0.15?{id:index+1,ms}:null;
  }
  function readCW(runs,start,ms,cluster) {
    let width=0;for(let j=0;j<8;j++) width+=runs[start+j]||0;
    if(width<14||width/ms<13||width/ms>22) return -1;
    // ZXing's sample-at-module-centres normalization (17 modules / 8 runs).
    let pattern=0,run=0,end=runs[start];
    for(let j=0;j<17;j++) {
      const x=(j+0.5)*width/17;
      while(run<7 && x>=end) {run++;end+=runs[start+run];}
      pattern=(pattern<<1)|(run%2===0?1:0);
    }
    const cw=CW_MAP.get(pattern);
    return cw && cw.cluster===cluster?cw.value:-1;
  }
  function fit(points,key) {
    const n=points.length,meanR=points.reduce((a,p)=>a+p.row,0)/n,meanV=points.reduce((a,p)=>a+p[key],0)/n;
    let den=0,num=0;for(const p of points) {den+=(p.row-meanR)**2;num+=(p.row-meanR)*(p[key]-meanV);}
    if(!den) return null;const slope=num/den;
    return {slope,at:r=>meanV+slope*(r-meanR)};
  }
  const median = values => {const a=values.slice().sort((x,y)=>x-y);return a[Math.floor(a.length/2)];};
  function decodeCluster(group,a,frameId) {
    const variant=VARIANTS[group.vi], rows=new Map();
    for(const o of group.observations) {if(!rows.has(o.row)) rows.set(o.row,[]);rows.get(o.row).push(o);}
    if(rows.size<Math.max(3,Math.ceil(variant.rows*0.75))) return null;
    const rowPoints=Array.from(rows,([row,os])=>({row,y:median(os.map(o=>o.y)),x:median(os.map(o=>o.x)),right:median(os.map(o=>o.right))}));
    const fy=fit(rowPoints,'y'),fx=fit(rowPoints,'x'),fr=fit(rowPoints,'right');
    const ms=median(group.observations.map(o=>o.ms));
    if(!fy||!fx||!fr||fy.slope<0.75*ms||fy.slope>5*ms) return null;
    if(rowPoints.some(p=>Math.abs(p.y-fy.at(p.row))>Math.max(1.2,fy.slope*0.40))) return null;
    const codewords=[];
    for(let row=0;row<variant.rows;row++) for(let col=0;col<variant.cols;col++) {
      const counts=new Map();for(const o of rows.get(row)||[]) {const v=o.cws[col];if(v>=0) counts.set(v,(counts.get(v)||0)+1);}
      const votes=Array.from(counts).sort((x,y)=>y[1]-x[1]);
      codewords.push(votes.length && (votes.length===1||votes[0][1]>votes[1][1])?votes[0][0]:-1);
    }
    const corrected=correctCodewords(codewords,variant.ecc);if(!corrected) return null;
    try {
      const payload=corrected.codewords.slice(0,variant.rows*variant.cols-variant.ecc);
      const binary=payloadBits(payload,variant),raw=decodeCompositeBits(binary),fields=parseFields(raw);
      if(!fields || (!fields['17']&&!fields['10'])) return null;
      if(fields['01'] && !validGTIN(fields['01'])) return null;
      const top=-0.5,bottom=variant.rows-0.5;
      const p=[a.world(fx.at(top),fy.at(top)),a.world(fr.at(top),fy.at(top)),a.world(fr.at(bottom),fy.at(bottom)),a.world(fx.at(bottom),fy.at(bottom))];
      return {kind:variant.kind,verified:true,frameId,gtin:fields['01']||null,lot:fields['10']||null,
        expiryRaw:fields['17']||null,raw:hri(fields),elementString:raw,cornerPoints:p,position:boundingBox(p),
        rows:variant.rows,columns:variant.cols,correctedCodewords:corrected.corrected,erasedCodewords:corrected.erasures};
    } catch(_) { return null; }
  }
  function scanAboveLinear(gray,imageWidth,imageHeight,linear,frameId) {
    const a=axes(corners(linear.cornerPoints||linear.position));
    if(!a||a.width<35) return [];
    const W=a.width,x0=-0.55*W,x1=1.55*W,y0=a.top-1.40*W,y1=a.top+0.02*W;
    const rowStep=Math.max(1,Math.floor(W/350)),groups=[],sample=new Uint8Array(Math.ceil(x1-x0));
    const luminance=(x,y)=>{
      if(x<0||y<0||x>=imageWidth-1||y>=imageHeight-1) return 255;
      const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,k=iy*imageWidth+ix;
      return (gray[k]*(1-fx)+gray[k+1]*fx)*(1-fy)+(gray[k+imageWidth]*(1-fx)+gray[k+imageWidth+1]*fx)*fy;
    };
    for(let y=y0;y<y1;y+=rowStep) {
      let lo=255,hi=0;
      const origin=a.world(x0,y);
      for(let x=0;x<sample.length;x++) { const v=luminance(origin.x+x*a.u.x,origin.y+x*a.u.y);sample[x]=v;lo=Math.min(lo,v);hi=Math.max(hi,v); }
      if(hi-lo<50) continue;
      const threshold=(lo+hi)/2,runs=[],edges=[];let color=sample[0]<threshold,count=0;
      const firstBlack=color;
      for(let x=0;x<sample.length;x++) {
        const black=sample[x]<threshold;
        if(black===color) count++;else {runs.push(count);edges.push(x-count);color=black;count=1;}
      }
      runs.push(count);edges.push(sample.length-count);edges.push(sample.length);
      for(let start=firstBlack?0:1;start<runs.length-29;start+=2) {
        for(const layout of LAYOUTS) {
          if(start+layout.runs>=runs.length) continue;
          const left=layout.left==null?null:readRAP(runs,start+layout.left,false);
          if(layout.left!=null&&!left) continue;
          const center=layout.center==null?null:readRAP(runs,start+layout.center,true);
          if(layout.center!=null&&!center) continue;
          const right=readRAP(runs,start+layout.right,false);if(!right) continue;
          const key=[layout.id,left?.id||0,center?.id||0,right.id].join(':');
          const variants=signatures.get(key);if(!variants) continue;
          const ms=(edges[start+layout.runs]-edges[start])/layout.width;
          if(ms<0.95 || [left,center,right].filter(Boolean).some(r=>Math.abs(r.ms/ms-1)>0.25)) continue;
          const stop=runs[start+layout.right+6],quiet=runs[start+layout.runs];
          if(stop<0.45*ms||stop>1.8*ms||quiet<0.6*ms || (start>0 && runs[start-1]<0.6*ms)) continue;
          for(const vr of variants) {
            const cws=layout.cws.map(offset=>readCW(runs,start+offset,ms,vr.cluster));
            if(cws.filter(v=>v>=0).length<Math.max(1,cws.length-1)) continue;
            const o={row:vr.row,cws,ms,x:x0+edges[start],right:x0+edges[start+layout.runs],y};
            let selected=null,best=Infinity;
            for(const g of groups) {
              const last=g.last;
              if(g.vi!==vr.vi||o.y-last.y>Math.max(10*ms,2*rowStep)||o.row<last.row||o.row>last.row+4) continue;
              const distance=Math.abs(o.x-last.x);
              if(distance>Math.max(4*ms,0.07*layout.width*ms)||Math.abs(ms/last.ms-1)>0.20) continue;
              if(distance<best) {selected=g;best=distance;}
            }
            if(selected) {selected.observations.push(o);selected.last=o;}
            else groups.push({vi:vr.vi,last:o,observations:[o]});
          }
        }
      }
    }
    return groups.map(g=>decodeCluster(g,a,frameId)).filter(Boolean);
  }

  function duplicateComponents(components) {
    const groups=[];
    for(const c of components) {
      const b=c.position;
      const same=g=>{
        const a=g[0].position;
        const area=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
        return area/Math.max(1,a.width*a.height+b.width*b.height-area)>0.70;
      };
      const g=groups.find(same);if(g) g.push(c);else groups.push([c]);
    }
    // Conflicting successful decodes at one location are not evidence for a match.
    return groups.filter(g=>g.every(c=>c.raw===g[0].raw && c.kind===g[0].kind)).map(g=>g.sort((a,b)=>(a.correctedCodewords+a.erasedCodewords)-(b.correctedCodewords+b.erasedCodewords))[0]);
  }
  function decodeCompositeComponents(imageData,linears,frameId) {
    const {width,height,data}=imageData,gray=new Uint8Array(width*height);
    for(let i=0,j=0;i<gray.length;i++,j+=4) gray[i]=(data[j]*77+data[j+1]*150+data[j+2]*29)>>8;
    const components=[];
    for(const linear of linears) if(/^DataBar/.test(linear.format)) components.push(...scanAboveLinear(gray,width,height,linear,frameId));
    return duplicateComponents(components);
  }
  function rawString(barcode) {
    const bytes=barcode.bytes;
    // HRI parentheses may occur inside an actual Lot; prefer original ASCII bytes.
    if(bytes && bytes.length && Array.from(bytes).every(v=>v===29||(v>=32&&v<=126))) return String.fromCharCode(...bytes);
    return String(barcode.text||'').replace(/^\][A-Za-z0-9][0-9]/,'');
  }
  function makeRecords(barcodes,frameId) {
    const records=[];
    barcodes.forEach((r,sourceIndex)=>{
      if(!r||r.isValid===false||r.error) return;
      const format=r.format||r.symbology||'Unknown',raw=rawString(r);
      const isDataBar=/^DataBar/.test(format),isGS1=isDataBar||r.contentType==='GS1'||/^\](C1|d2|e[012])/.test(r.symbologyIdentifier||'');
      if(!isGS1) return;
      let fields=isDataBar&&/^\d{14}$/.test(raw)?{'01':raw}:parseFields(raw);
      const gtin=fields?.['01']||/^(?:01|\(01\))(\d{14})/.exec(raw)?.[1];
      if(!validGTIN(gtin)) return;
      const p=corners(r.position);
      records.push({gtin,format,expiryRaw:fields?.['17']||null,lot:fields?.['10']||null,
        linearRaw:fields?hri(fields):raw,compositeRaw:null,compositeMatched:false,
        position:boundingBox(p),cornerPoints:p,frameId,sourceIndex});
    });
    return records;
  }
  async function decodeFrameDetailed(imageData,options={}) {
    if(!imageData||!Number.isInteger(imageData.width)||!Number.isInteger(imageData.height)||imageData.width<1||imageData.height<1||
      !imageData.data||imageData.data.length!==imageData.width*imageData.height*4) throw new TypeError('decodeFrame requires RGBA ImageData');
    // Capture one immutable frame BEFORE the asynchronous WASM call.
    const pixels=new Uint8ClampedArray(imageData.data);
    const frame=typeof ImageData!=='undefined'?new ImageData(pixels,imageData.width,imageData.height):{width:imageData.width,height:imageData.height,data:pixels};
    const frameId=++nextFrameId;
    const read=options.readBarcodes||globalThis.ZXingWASM?.readBarcodes;
    if(typeof read!=='function') throw new Error('zxing-wasm readBarcodes is required');
    const barcodes=await read(frame,{
      formats:DEFAULT_FORMATS,tryHarder:true,tryRotate:true,tryInvert:false,tryDownscale:true,
      maxNumberOfSymbols:32,textMode:'HRI',...(options.readerOptions||{})
    });
    const records=makeRecords(barcodes||[],frameId);
    let components=[],compositeError=null;
    try { components=decodeCompositeComponents(frame,records,frameId); }
    catch(e) { compositeError=String(e?.message||e); }
    for(const match of matchCompositeComponents(records,components)) {
      const record=records[match.linearIndex],component=components[match.componentIndex];
      record.expiryRaw=component.expiryRaw||record.expiryRaw;
      record.lot=component.lot||record.lot;
      record.compositeRaw=component.raw;
      record.compositeMatched=true;
      record.compositeFormat=component.kind;
      record.compositePosition=component.position;
    }
    return {frameId,records,barcodes:barcodes||[],components,compositeError};
  }
  async function decodeFrame(imageData,options={}) { return (await decodeFrameDetailed(imageData,options)).records; }
  return Object.freeze({version:'0.3.0',zxingVersion:'3.1.3',decodeFrame,decodeFrameDetailed,
    matchCompositeComponents,decodeCompositeComponents});
});
