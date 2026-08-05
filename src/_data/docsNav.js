// Links shown in the site header's Documentation dropdown.
// Mirrors the top-level sections of docs.ceph.com.
module.exports = [
  { title: 'Installation', url: 'https://docs.ceph.com/en/latest/install/' },
  { title: 'Cephadm', url: 'https://docs.ceph.com/en/latest/cephadm/' },
  {
    title: 'Cluster Operations',
    url: 'https://docs.ceph.com/en/latest/rados/',
  },
  {
    title: 'Object Storage (RGW)',
    url: 'https://docs.ceph.com/en/latest/radosgw/',
  },
  { title: 'Block Storage (RBD)', url: 'https://docs.ceph.com/en/latest/rbd/' },
  {
    title: 'File System (CephFS)',
    url: 'https://docs.ceph.com/en/latest/cephfs/',
  },
];
