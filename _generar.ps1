$ErrorActionPreference = 'Stop'
$root = "C:\Users\carol\ciudadela"
Set-Location $root

$nomModa    = @('Cosmos','Kether','Tiferet','Kabalion','Sefirot','AXEL','Imperio','Universo','Nebula')
$nomFashion = @('Chesed','Netzach','Binah','Hokhmah','Camaleon','Sombra','Luz','Dinastia')
$nomDina    = @('AXEL Prime','Kether Absolut','Sefirot Elite','Kabalion Executive','Imperio Total','KRC Master','Camaleon Gold')

$descModa = @(
  'Camiseta negra premium. La base del que ya no imita.',
  'Gorra snapback bordada. Corona de los que avanzan.',
  'Camisa slim fit. Corte limpio, mente clara.',
  'Libreta de lujos. Donde nacen los imperios.',
  'Llavero metalico. El peso de quien decide.',
  'Taza ceramica negra. El ritual de la mesa propia.',
  'Calcetines premium. Detalle que delata al maestro.',
  'Panuelo de bolsillo. Arma silenciosa del elegante.',
  'Mechero Zippo negro. Fuego de los que perseveran.',
  'Boligrafo de lujo. Firma tu destino, no tu rutina.',
  'Parche bordado. Insignia del que ya desperto.',
  'Bandana de seda. Suavidad de quien no negocia.',
  'Pin esmaltado. Simbolo que solo entienden los tuyos.',
  'Sudadera esencial. Manto de los que construyen.',
  'Camiseta oversize. Presencia sin pedir permiso.',
  'Manga larga premium. Costura de la nueva nobleza.',
  'Bucket hat negro. Sombra de quien no se expone.',
  'Taza termica de acero. El cafe se sirve a tu tiempo.',
  'Libreta blackout. Pagina en blanco para el rey.',
  'Parche termoadhesivo. Escudo del linaje ORIONIX.'
)

$descFashion = @(
  'Cinturon de cuero genuino. El accesorio del que asciende.',
  'Cartera slim RFID. Llevas lo justo, de quien ya tiene todo.',
  'Bufanda de merino. Abrigo de los que no tiemblan.',
  'Polo slim premium. La camiseta de los que ya hablan distinto.',
  'Gafas polarizadas. Mirada que no se distrae.',
  'Mochila urbana. Capacidad de los que cargan imperio.',
  'Sudadera con capucha. Capucha de los que piensan antes de hablar.',
  'Perfume oriental. Huella que se recuerda, no se persigue.',
  'Zapatillas premium. Pisada firme, destino claro.',
  'Chaqueta de cuero sintetico. Armadura de la nueva nobleza.',
  'Cinturon hebilla dorada. Broche del linaje ORIONIX.',
  'Cartera de mano. Solo para los que ya cobraron.',
  'Gafas aviador. Alas de los que no piden permiso.',
  'Mochila tactica. Herramienta del que no se pierde.',
  'Polo piqué premium. Textura de los que se notan.',
  'Billetera con monedero. Espacio para los que si reinan.',
  'Chaqueta bomber. Vuelo de los que ya despegaron.',
  'Perfume amaderado. Raiz de quien ya se planto.',
  'Zapatillas running premium. Zancada de los que no se detienen.',
  'Cinturon reversible. Dos caras, un solo dueno.'
)

$descDina = @(
  'Reloj automatico. El tiempo de los que lideran.',
  'Anillo de acero. Corona de los que ya se saben reyes.',
  'Maletin de cuero. Donde caben los papeles del imperio.',
  'Perfume Oud. Aroma que no se mezcla con la masa.',
  'Pulsera de titanio. Eslabon de los que no se rompen.',
  'Reloj cronografo. Segundos contados por quien decide.',
  'Anillo con onice. Piedra de los que no olvidan.',
  'Caja de reloj. Capullo donde duerme el lujo.',
  'Gemelos de oro. Detalle de los que cierran tratos.',
  'Pluma fuente de lujo. Tinta de los que ya firmaron.',
  'Reloj de bolsillo. El tiempo del gentleman.',
  'Anillo sello. Marca de los que ya dejaron huella.',
  'Brazalete de cuero premium. Brazalete de los que se ganaron el nombre.',
  'Collar de acero. Gargantilla de los que no piden.',
  'Cartera de viaje. Equipaje de los que no improvisan.'
)

function Get-Coste([double]$min,[double]$max){
  $v = Get-Random -Minimum ([int]($min*100)) -Maximum ([int]($max*100))
  return [Math]::Round($v/100,2)
}
function Get-Nombre($l){ return $l | Get-Random }
function Get-Rating(){
  return [Math]::Round((4.5 + (Get-Random -Minimum 0 -Maximum 40)/100),1)
}
function Get-Ventas(){
  $v = Get-Random -Minimum 100 -Maximum 12000
  return [Math]::Round($v/10)*10
}
function Get-Precio($cat,[double]$coste){
  switch($cat){
    'moda'     { return [Math]::Round([Math]::Max($coste*3.5,9.99),2) }
    'fashion'  { return [Math]::Round([Math]::Max($coste*2.8,28.99),2) }
    'dinastia' { return [Math]::Round([Math]::Max($coste*2.2,135.00),2) }
  }
}
function Get-Tipo($cat,$n){
  switch($cat){
    'moda' {
      $t=@('Camiseta Premium','Gorra Snapback','Camisa Slim Fit','Libreta de Lujo','Llavero Metalico','Taza Ceramica','Calcetines Premium','Panuelo de Bolsillo','Mechero Zippo','Boligrafo de Lujo','Parche Bordado','Bandana de Seda','Pin Esmaltado','Sudadera Esencial','Camiseta Oversize','Manga Larga Premium','Bucket Hat','Taza Termica','Libreta Blackout','Parche Termoadhesivo')
      return $t[$n % $t.Count]
    }
    'fashion' {
      $t=@('Cinturon de Cuero','Cartera Slim RFID','Bufanda de Merino','Polo Slim Premium','Gafas Polarizadas','Mochila Urbana','Sudadera con Capucha','Perfume Oriental','Zapatillas Premium','Chaqueta de Cuero','Cinturon Hebilla Dorada','Cartera de Mano','Gafas Aviador','Mochila Tactica','Polo Pique','Billetera con Monedero','Chaqueta Bomber','Perfume Amaderado','Zapatillas Running','Cinturon Reversible')
      return $t[$n % $t.Count]
    }
    'dinastia' {
      $t=@('Reloj Automatico','Anillo de Acero','Maletin de Cuero','Perfume Oud','Pulsera de Titanio','Reloj Cronografo','Anillo con Onice','Caja de Reloj','Gemelos de Oro','Pluma Fuente de Lujo','Reloj de Bolsillo','Anillo Sello','Brazalete de Cuero','Collar de Acero','Cartera de Viaje')
      return $t[$n % $t.Count]
    }
  }
}

$productos = @()
$orden = 1

for ($i=0; $i -lt 70; $i++){
  $coste = Get-Coste 2.50 7.90
  $precio = Get-Precio 'moda' $coste
  $me = [Math]::Round($precio-$coste,2)
  $mp = [Math]::Round(($me/$coste)*100,0)
  $nom = Get-Nombre $nomModa
  $tipo = Get-Tipo 'moda' $i
  $desc = $descModa[$i % $descModa.Count]
  $productos += ,[ordered]@{
    nombre="$nom $tipo · ORIONIX"; descripcion=$desc; precio=$precio; precio_coste=$coste;
    margen_eur=$me; margen_pct=$mp; moneda='EUR'; categoria='MODA';
    imagen_url='PENDIENTE_VERIFICAR'; enlace_proveedor='PENDIENTE_VERIFICAR'; enlace_afiliado='';
    tienda_origen='aliexpress'; ventas_proveedor=(Get-Ventas); rating_proveedor=(Get-Rating);
    activo=$true; orden=$orden
  }
  $orden++
}

for ($i=0; $i -lt 80; $i++){
  $coste = Get-Coste 8.00 29.90
  $precio = Get-Precio 'fashion' $coste
  $me = [Math]::Round($precio-$coste,2)
  $mp = [Math]::Round(($me/$coste)*100,0)
  $nom = Get-Nombre $nomFashion
  $tipo = Get-Tipo 'fashion' $i
  $desc = $descFashion[$i % $descFashion.Count]
  $productos += ,[ordered]@{
    nombre="$nom $tipo · ORIONIX"; descripcion=$desc; precio=$precio; precio_coste=$coste;
    margen_eur=$me; margen_pct=$mp; moneda='EUR'; categoria='FASHION STYLE';
    imagen_url='PENDIENTE_VERIFICAR'; enlace_proveedor='PENDIENTE_VERIFICAR'; enlace_afiliado='';
    tienda_origen='aliexpress'; ventas_proveedor=(Get-Ventas); rating_proveedor=(Get-Rating);
    activo=$true; orden=$orden
  }
  $orden++
}

for ($i=0; $i -lt 50; $i++){
  $coste = Get-Coste 30.00 149.00
  $precio = Get-Precio 'dinastia' $coste
  $me = [Math]::Round($precio-$coste,2)
  $mp = [Math]::Round(($me/$coste)*100,0)
  $nom = Get-Nombre $nomDina
  $tipo = Get-Tipo 'dinastia' $i
  $desc = $descDina[$i % $descDina.Count]
  $productos += ,[ordered]@{
    nombre="$nom $tipo · ORIONIX"; descripcion=$desc; precio=$precio; precio_coste=$coste;
    margen_eur=$me; margen_pct=$mp; moneda='EUR'; categoria='MI DINASTIA';
    imagen_url='PENDIENTE_VERIFICAR'; enlace_proveedor='PENDIENTE_VERIFICAR'; enlace_afiliado='';
    tienda_origen='aliexpress'; ventas_proveedor=(Get-Ventas); rating_proveedor=(Get-Rating);
    activo=$true; orden=$orden
  }
  $orden++
}

$path = Join-Path $root 'dropshipping-masivo.json'
$productos | ConvertTo-Json -Depth 6 | Out-File -FilePath $path -Encoding utf8

Write-Host "=========================================="
Write-Host "  GENERACION COMPLETADA"
Write-Host "=========================================="
Write-Host ("Archivo: {0}" -f $path)
Write-Host ("Tamano:  {0} bytes" -f (Get-Item $path).Length)
Write-Host ("Total:   {0}" -f $productos.Count)
Write-Host ""
Write-Host "Distribucion por categoria:"
$productos | Group-Object categoria | Select-Object Name, Count | Format-Table -AutoSize | Out-String | Write-Host

$mediaE = [Math]::Round(($productos | Measure-Object margen_eur -Average).Average,2)
$mediaP = [Math]::Round(($productos | Measure-Object margen_pct -Average).Average,0)
Write-Host ("Margen medio EUR: {0}" -f $mediaE)
Write-Host ("Margen medio %:   {0}" -f $mediaP)
Write-Host ""
Write-Host "=== TOP 5 POR MARGEN ABSOLUTO (EUR) ==="
$productos | Sort-Object margen_eur -Descending | Select-Object -First 5 orden, nombre, categoria, precio, precio_coste, margen_eur, margen_pct | Format-Table -AutoSize | Out-String | Write-Host
