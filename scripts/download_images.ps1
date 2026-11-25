[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$images = @{
    "hero-food.jpg" = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
    "jollof-chicken.jpg" = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    "fried-rice.jpg" = "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"
    "peppered-beef.jpg" = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    "grilled-fish.jpg" = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
    "creamy-pasta.jpg" = "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80"
    "chicken-wings.jpg" = "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80"
    "egusi-soup.jpg" = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
    "pepper-soup.jpg" = "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
    "seafood-okra.jpg" = "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80"
    "meat-pie.jpg" = "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80"
    "shawarma.jpg" = "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80"
    "chapman.jpg" = "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
    "smoothie.jpg" = "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80"
    "dessert-cake.jpg" = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    "about-dining.jpg" = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
    "about-kitchen.jpg" = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
    "restaurant-interior.jpg" = "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80"
    "reservation-bg.jpg" = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"
    "gallery-event.jpg" = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
    "gallery-plating.jpg" = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
}

foreach ($key in $images.Keys) {
    $dest = "assets\images\$key"
    if (-not (Test-Path $dest)) {
        Write-Host "Downloading $key..."
        try {
            Invoke-WebRequest -Uri $images[$key] -OutFile $dest -UserAgent "Mozilla/5.0" -TimeoutSec 15 -UseBasicParsing
            Write-Host "Done $key"
        } catch {
            Write-Warning "Failed ${key} - error: $_"
        }
    } else {
        Write-Host "Already exists: $key"
    }
}
Write-Host "All downloads processed."
