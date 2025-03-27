import { ClipboardCheck, Clipboard } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

type CopyLinkProps = {
  text: string;
};

const CopyLink: React.FC<CopyLinkProps> = ({ text }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "The shareable link has been copied to your clipboard.",
      variant: "default",
      duration: 2000
    });
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      className="transition-colors"
    >
      {copied ? (
        <ClipboardCheck className="w-5 h-5 text-green-500 mr-2" />
      ) : (
        <Clipboard className="w-5 h-5 mr-2" />
      )}
      {copied ? "Copied" : "Copy Link"}
    </Button>
  );
};

export default CopyLink;
