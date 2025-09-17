"use client";

import { InfoIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const options = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
] as const;

type FormValues = {
  nameOrAlias: string;
  publicChoice: "yes" | "no" | null;
};

const NameOrAlias = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nameOrAlias: "",
      publicChoice: "yes",
    },
  });
  const { connectTwitter, twitterLinked, signDocument } = useAuthStore();
  const t = useTranslations('Signature');
  const onSubmit = (data: FormValues) => {
    signDocument({
      alias: data.nameOrAlias,
      wantNameInLeaderboard: data.publicChoice === "yes",
      signedByText: t('signedBy'),
    });
  };

  const selected = watch("publicChoice");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4 min-h-[390px]"
    >
      <Input
        placeholder="Name or Alias"
        {...register("nameOrAlias", { required: "Name or alias is required" })}
        error={errors?.nameOrAlias?.message}
      />
      <div className="flex gap-2 mt-3">
        <Text variant={"Lg"}>
          Do you want your name or alias to be public in the <Link href="/leaderboard" target="_blank" className="transition ease-linear duration-150 underline hover:opacity-80">leaderboard</Link>?
        </Text>
      </div>
      <div className="flex flex-col gap-6">
        {options.map(({ id, label }) => (
          <Controller
            key={id}
            name="publicChoice"
            control={control}
            render={({ field }) => (
              <div className="flex items-center">
                <Checkbox
                  id={id}
                  checked={field.value === id}
                  onCheckedChange={() =>
                    field.onChange(field.value === id ? null : id)
                  }
                />
                <Label htmlFor={id} className="pl-2">
                  {label}
                </Label>
              </div>
            )}
          />
        ))}
      </div>
      {selected === "yes" && (
        <div className="flex flex-col items-center justify-center">
          <Text variant={"Lg"}>
            Do you want your X username to be public in the <Link href="/leaderboard" target="_blank"  className="transition ease-linear duration-150 underline hover:opacity-80">leaderboard</Link>?
          </Text>
          <div className="w-full gap-5 mt-5 flex justify-center">
            <Button
              type="button"
              onClick={connectTwitter}
              disabled={twitterLinked}
            >
              {twitterLinked ? "Connected" : "Yes, connect"}
              <Image
                src="/assets/images/twitter.png"
                alt="twitter"
                width={30}
                height={30}
              />
            </Button>
          </div>
        </div>
      )}
      <Button type="submit" className="text-xl py-3 bg-orange text-white mt-4">
        Sign
      </Button>
    </form>
  );
};

export default NameOrAlias;
