type Props = {
  params: {
    userID: string;
  };
};

export default function userDetails({ params: { userID } }: Props) {
  return <p>user details {userID}</p>;
}
