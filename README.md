# mern-authentication-flow
This is a complete MERN Stack JWT Authentication Flow using Typescript.

The server uses more of typescript. However, the client side does not use much features of typescript. I will update it in the future with Typescript React.\

In the backend, we store the access token simply in a variable. This means we lose access token everytime the website refreshes.
The access token is sent as header - Authorization Bearer in every request to backend
The Refresh Token is saved as cookie in the browser on logging in. Everytime, the website loads, we sent a request to the renewAccessToken to get a new access token in exchange of the refresh token which is stored in cookie.

If the access token expires and we try to access a protected route then we get a 401 unauthorized response. The axios client is configured in a way that as soon as it gets this unauthorized response it automatically makes a request to backend to renew the access token and gets a new access token. This persists the user session in our website.

If the refresh token is lost, then when the page loads, we don't get any response when we make request to renew access token. Thus, access token does not get set and hence, we are redirected to login page when we try to access secret page due to conditional check in the useEffect of secret page.

