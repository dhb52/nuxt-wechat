import lscache from 'lscache'

// eslint-disable-next-line no-unused-vars
export default ({ app }, inject) => {
  inject('lscache', lscache)
}
