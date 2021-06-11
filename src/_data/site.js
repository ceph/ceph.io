module.exports = {
  title: 'Ceph',
  url: 'https://ceph.io',
  buildTime: new Date(),
  defaultLocale: 'en',
  social: {
    facebook: '@cephstorage',
    twitter: '@ceph',
  },
  isProduction: process.env.NODE_ENV === 'production',
};
