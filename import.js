function parse_albums() {
    let album_blocks = document.getElementsByClassName('c-gallery-vertical-album')

    let parsed_albums = []
    try {
        for(const idx in album_blocks) {
            let ab = album_blocks[idx]
            let album = {}
            let fields = ['image', 'number', 'title', 'subtitle', 'description'];
            for(const fidx in fields) {
                let f = fields[fidx]
                class_name = `c-gallery-vertical-album__${f}`
                value = ab.getElementsByClassName(class_name)[0]
                if(f == 'image') {
                    album[f] = value.src
                } else if(f == 'number') {
                    album[f] = parseInt(value.innerText)
                } else if(f == 'title') {
                    let artist_and_album = value.innerText.split(", \u2018")
                    album['artist'] = artist_and_album[0]
                    album['title'] = artist_and_album[1].slice(0, -1)
                } else if(f == 'subtitle') {
                    let label_and_year = value.innerText.match(/(?<label>.*), (?<year>\d{4})/)
                    album['label'] = label_and_year.groups.label;
                    album['year'] = label_and_year.groups.year;
                } else {
                    album[f] = value.innerText.replace('\r', '').replace('\n', '')
                }
            }
            parsed_albums.push(album)
        }
    } catch(e) {
        console.log(e)
    }

    let csv = ''

    let keysAmount = Object.keys(parsed_albums[0]).length
    let keysCounter = 0
    // Loop each property of the object
    for(let key in parsed_albums[0]){

        // This is to not add a comma at the last cell
        // The '\r\n' adds a new line
        csv += key + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
        keysCounter++
    }

    // Loop the array of objects
    for(let row = 0; row < parsed_albums.length; row++){
        keysCounter = 0

        for(let key in parsed_albums[row]){
            csv += `"${parsed_albums[row][key]}"` + (keysCounter+1 < keysAmount ? ',' : '\r\n' )
            keysCounter++
        }
    }

    // Once we are done looping, download the .csv by creating a link
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', 'yourfiletextgoeshere.txt');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()
}
