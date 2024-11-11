import ResetPasswordForm from "@/sections/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password",
};

interface ResetPasswordTokenProps {
    params: { token: string };
}

const ResetPasswordTokenPage = ({ params }: ResetPasswordTokenProps) => {
    const { token } = params;
    return <ResetPasswordForm token={token} />;
};

export default ResetPasswordTokenPage;
