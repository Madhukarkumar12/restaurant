
import { Loader2, Mail, MapPin, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, updateProfile } = useUserStore();
    console.log(user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        profilePicture: user?.profilePicture || "",
    });
    
    const imageRef = useRef<HTMLInputElement>(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData?.profilePicture || "");

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedProfilePicture(result);
                setProfileData(prev => ({ ...prev, profilePicture: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await updateProfile(profileData);
            navigate("/");
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-orange-500 py-6 px-8 text-white">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-orange-100">Manage your account details</p>
                </div>

                <form onSubmit={updateProfileHandler} className="p-8">
                    {/* Profile Picture & Name Section */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-orange-100 shadow-md">
                                <AvatarImage src={selectedProfilePicture} />
                                <AvatarFallback className="bg-orange-200 text-orange-600 text-4xl font-bold">
                                    {profileData.fullname.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                ref={imageRef}
                                className="hidden"
                                type="file"
                                accept="image/*"
                                onChange={fileChangeHandler}
                            />
                            <button
                                type="button"
                                onClick={() => imageRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40 rounded-full cursor-pointer"
                            >
                                <div className="bg-orange-500 p-3 rounded-full">
                                    <Mail className="text-white w-5 h-5" />
                                </div>
                            </button>
                        </div>
                        
                        <div className="flex-1 w-full">
                            <Label className="block text-sm font-medium text-gray-600 mb-1">Full Name</Label>
                            <Input
                                type="text"
                                name="fullname"
                                value={profileData.fullname}
                                onChange={changeHandler}
                                className="text-2xl font-bold border-b-2 border-gray-200 focus:border-orange-500 px-0 py-1 rounded-none focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {/* Email */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-5 h-5 text-orange-500" />
                                Email Address
                            </Label>
                            <Input
                                disabled
                                name="email"
                                value={profileData.email}
                                onChange={changeHandler}
                                className="bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-orange-500 rounded-none px-0 py-2 focus-visible:ring-0"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                Street Address
                            </Label>
                            <Input
                                name="address"
                                value={profileData.address}
                                onChange={changeHandler}
                                className="border-0 border-b-2 border-gray-200 focus:border-orange-500 rounded-none px-0 py-2 focus-visible:ring-0"
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                City
                            </Label>
                            <Input
                                name="city"
                                value={profileData.city}
                                onChange={changeHandler}
                                className="border-0 border-b-2 border-gray-200 focus:border-orange-500 rounded-none px-0 py-2 focus-visible:ring-0"
                            />
                        </div>

                        {/* Country */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-gray-600">
                                <Globe className="w-5 h-5 text-orange-500" />
                                Country
                            </Label>
                            <Input
                                name="country"
                                value={profileData.country}
                                onChange={changeHandler}
                                className="border-0 border-b-2 border-gray-200 focus:border-orange-500 rounded-none px-0 py-2 focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-orange-500 bg-orange hover:bg-orange-50 text-white"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange hover:bg-orange shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;