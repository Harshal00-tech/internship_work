module.exports = (req, res) => {
    res.status(404).render('404', {docTitle : 'Page not Found', path : 'Page Not Found'})
}