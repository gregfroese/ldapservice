# Profile Service
A node.js based web service that provides user authentication against LDAP server (Active Directory / Windows network) credentials and returns a JSON Web Token.
Optional Rabbit MQ integration to allow this service to talk to other services to validate tokens sent to other API's, allowing all authentication to be in one spot.

# Usage
Copy config/app.yaml.sample to config/app.yaml and update the values accordingly.
Default configuration searches using the same login name you use when logging on with Windows.

Send an HTTP POST to `/authenticate` with username and password values, a JSON Web Token (JWT) is returned on success, or an error message on failure.

# Rabbit MQ integration
Provides an RPC interface through Rabbit MQ.  Will validate a token passed in and return the user data to the calling service.

# Credit
Heavily modeled after this post: http://www.sitepoint.com/using-json-web-tokens-node-js/

# Available attributes about a user after authentication
```
{
  dn: 'CN=User Name,OU=Organizational Unit Name,DC=domain,DC=com',
  controls: [],
  objectClass: ['top', 'person', 'organizationalPerson', 'user'],
  cn: 'User name',
  sn: 'Last name',
  telephoneNumber: '246',
  givenName: 'First name',
  distinguishedName: 'CN=FirstName LastName,OU=Organizational Unit Name,DC=domain,DC=com',
  instanceType: '4',
  whenCreated: '20140514132316.0Z',
  whenChanged: '20140728135818.0Z',
  displayName: 'FirstName LastName',
  uSNCreated: '1096347',
  memberOf: 'CN=Information Systems,OU=Organizational Unit Name,DC=domain,DC=com',
  uSNChanged: '1776359',
  name: 'FirstName LastName',
  objectGUID: '�vs\u0010���B��ʕP�~N',
  userAccountControl: '512',
  badPwdCount: '0',
  codePage: '0',
  countryCode: '0',
  badPasswordTime: '130513877407546437',
  lastLogoff: '0',
  lastLogon: '130513892045366582',
  pwdLastSet: '130504311941941282',
  primaryGroupID: '513',
  objectSid: '\u0001\u0005\u0000\u0000\u0000\u0000\u0000\u0005\u0015\u0000\u0000\u0000\u0011�_sMdI.�=+F�\u0010\u0000\u0000',
  accountExpires: '0',
  logonCount: '277',
  sAMAccountName: 'loginName',
  sAMAccountType: '805306368',
  userPrincipalName: 'useremail@domain.com',
  objectCategory: 'CN=Person,CN=Schema,CN=Configuration,DC=domain,DC=com',
  dSCorePropagationData: '16010101000000.0Z',
  lastLogonTimestamp: '130510294983499545',
  mail: 'useremail@domain.com'·
}
```

# TO DO
Parse the group information to return an array of just the group names

