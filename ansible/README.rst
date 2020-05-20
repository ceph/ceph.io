Deployment Playbook
===================

This ansible role can be used to configure/reconfigure the ceph.io website.

Prerequisites
-------------

- Ubuntu 20.04 server with a public IP
- nginx is the only supported webserver
- Run the ``users``, ``common``, and ``public_facing`` roles from the ceph-cm-ansible_ repo.  This is optional but is an easy way to set up user accounts, SSH keys, nagios monitoring, firewall, and fail2ban.
- You **must** obtain a wildcard_ SSL certificate and put it in place on the server before running this role.
- Run ``ansible-playbook -M ./library/ slave_static.yml -e ansible_ssh_user=cm -e grant_sudo=false --extra-vars '{"labels": "www"}' -e token=XXXXX --limit="www.ceph.io"`` from the ceph-build.git_ repo to set up the Jenkins agent process that will build the site when new branches get pushed to **this** repo.

.. _ceph-cm-ansible: https://github.com/ceph/ceph-cm-ansible
.. _wildcard: https://medium.com/@utkarsh_verma/how-to-obtain-a-wildcard-ssl-certificate-from-lets-encrypt-and-setup-nginx-to-use-wildcard-cfb050c8b33f
.. _ceph-build.git: https://github.com/ceph/ceph-build

Variables
---------

I'd be surprised if this playbook got reused for any purpose other than setting up ceph.io but if desired, override these vars set in ``defaults/main.yml``

+----------------------------------------------+-----------------------------------------------------------------------------------------------+
|                                              | Description                                                                                   |
| Variable                                     |                                                                                               |
+==============================================+===============================================================================================+
| ``fqdn: beta.ceph.io``                       | Fully qualified domain name of webserver.                                                     |
+----------------------------------------------+-----------------------------------------------------------------------------------------------+
| ``install_dir: /opt/www``                    | Directory in which to clone and serve the ceph.io static site repo.                           |
+----------------------------------------------+-----------------------------------------------------------------------------------------------+
| ``branch: master``                           | Branch of this repo to serve.  This is useful for testing site changes.                       |
+----------------------------------------------+-----------------------------------------------------------------------------------------------+
| ``update_frequency: 5``                      | How often (in minutes) a cronjob should check for updates to this repo and publish a new site.|
+----------------------------------------------+-----------------------------------------------------------------------------------------------+
| ::                                           | List of domains we should obtain letsencrypt certificates for                                 |
|                                              |                                                                                               |
|   letsencrypt_domains:                       |                                                                                               |
|     - beta.ceph.io                           |                                                                                               |
+----------------------------------------------+-----------------------------------------------------------------------------------------------+
| ``letsencrypt_email: ceph-infra@redhat.com`` | E-mail address letsencrypt notifications should be sent to.                                   |
+----------------------------------------------+-----------------------------------------------------------------------------------------------+
| ::                                           | System packages to install using `apt`.                                                       |
|                                              |                                                                                               |
|   packages:                                  |                                                                                               |
|     - nginx                                  |                                                                                               |
|     - certbot                                |                                                                                               |
|     - npm                                    |                                                                                               |
+----------------------------------------------+-----------------------------------------------------------------------------------------------+

Note that ``ufw`` and ``fail2ban`` get installed by the afformentioned public_facing_ role.

.. _public_facing: https://github.com/ceph/ceph-cm-ansible/tree/master/roles/public_facing

Tags
----

``packages``: Just installs and updates packages

``nginx``: Performs nginx-only tasks

``letsencrypt``: Only creates or renews cert

``npm``: Just does the git and npm tasks

How-Tos
-------

To just update the branch the site serves from (We used the ``develop`` branch when setting up the static site), run::

    ansible-playbook run.yml -e branch=$branch --tags npm
