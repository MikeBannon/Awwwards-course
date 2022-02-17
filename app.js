require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDom = require('prismic-dom')
const { response } = require('express')

const initApi = req => {
  return Prismic.getGraphQLEndpoint(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {
  // if (doc.type === 'page') {
  //   return '/page/' + doc.uid
  // } else if (doc.type === 'blog_post') {
  //   return '/blog/' + doc.uid
  // }

  return '/'
}

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }

  res.locals.PrismicDom = PrismicDom
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home', {
  })
})

app.get('/about', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['meta', 'about'])).then(response => {
      console.log(response)
    })
  })

  res.render('pages/about', {
    about
  })
})

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail', {
  })
})

app.get('/collections', (req, res) => {
  res.render('pages/collections', {
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
