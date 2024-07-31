import { getAccessToken, getLogtoContext, signIn, signOut } from '@logto/next/server-actions';
import SignIn from './sign-in';
import SignOut from './sign-out';
import { logtoConfig } from './logto';
import GetAccessToken from './get-access-token';
import { headers } from 'next/headers';

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const getToken = async () => {
  const cookieHeader = headers().get("cookie") as unknown as string;
  const res = await fetch(`${baseUrl}/token`,
    { headers: { cookie: cookieHeader } }
  );
  return await res.json();
}

export default async function Home() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (isAuthenticated) {
    const { token } = await getToken();
    console.log(token);
  }

  return (
    <main>
      <h1>Hello Logto.</h1>
      <img src="http://localhost:3000/token" style={{ display: "none" }} />
      <div>
        {isAuthenticated ? (
          <>
            <SignOut
              onSignOut={async () => {
                'use server';

                await signOut(logtoConfig);
              }}
            />
            <GetAccessToken
              onGetAccessToken={async () => {
                'use server';

                return getAccessToken(logtoConfig, logtoConfig.resources?.[0]);
              }}
            />
          </>
        ) : (
          <SignIn
            onSignIn={async () => {
              'use server';

              await signIn(logtoConfig);
            }}
          />
        )}
      </div>
      {claims && (
        <div>
          <h2>Claims:</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(claims).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
