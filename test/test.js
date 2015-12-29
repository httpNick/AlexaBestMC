var rhyme = require('rhyme-plus');

rhyme((r) => {
    console.log(r.rhyme('bed').join(' '));
});
