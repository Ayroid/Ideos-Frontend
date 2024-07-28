import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getAccessTokenRaw, getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/pages/auth/signin");
  const accessToken = await getAccessTokenRaw();

  let data;

  console.log(process.env.SERVER_URL);

  try {
    const response = await fetch(`${process.env.SERVER_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    data = { error: "Failed to fetch data" };
  }

  return (
    <div>
      <h1>
        Hey {user.given_name} {user.family_name}
      </h1>
      <img src={user.picture!} alt="user profile" />
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
};

export default Page;
