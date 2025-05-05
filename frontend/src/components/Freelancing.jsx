import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useSelector } from 'react-redux';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Freelancing = () => {
  const userId = useSelector((store) => store.auth.user?._id);
  const [gigs, setGigs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    rate: '',
    tags: '',
    available: true
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${USER_API_END_POINT}/freelancing/${userId}`, {
          withCredentials: true
        });
        setGigs(Array.isArray(response.data.gigs) ? response.data.gigs : []);
        toast.success("Gigs loaded successfully!");
      } catch (error) {
        toast.error("Failed to fetch gigs.");
        setGigs([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGigs();
    }
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddGig = async () => {
    if (!form.title || !form.rate) {
      toast.warning("Title and Rate are required.");
      return;
    }

    const newGig = {
      title: form.title,
      description: form.description,
      rate: parseFloat(form.rate),
      available: form.available,
      tags: form.tags.split(',').map(tag => tag.trim())
    };

    setSubmitting(true);
    try {
      const response = await axios.post(`${USER_API_END_POINT}/freelancing/${userId}`, newGig, {
        withCredentials: true
      });

      const addedGig = response.data.gig;
      if (addedGig && addedGig.title) {
        setGigs([...gigs, addedGig]);
        toast.success("Gig added successfully!");
      }

      setForm({ title: '', description: '', rate: '', tags: '', available: true });
    } catch (error) {
      toast.error("Failed to add gig.");
      console.error("Error adding freelancing gig:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveGig = async (index) => {
    const confirm = window.confirm("Are you sure you want to remove this gig?");
    if (!confirm) return;

    try {
      await axios.delete(`${USER_API_END_POINT}/freelancing/${userId}/${index}`, {
        withCredentials: true
      });
      const updatedGigs = gigs.filter((_, idx) => idx !== index);
      setGigs(updatedGigs);
      toast.success("Gig removed successfully!");
    } catch (error) {
      toast.error("Failed to remove gig.");
      console.error("Error removing freelancing gig:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Freelancing Gigs</h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Input name="title" placeholder="Title (e.g. Web Developer)" value={form.title} onChange={handleChange} />
        <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <Input name="rate" type="number" placeholder="Rate (₹ per project/hour)" value={form.rate} onChange={handleChange} />
        <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
        <div className="flex items-center gap-2">
          <Switch checked={form.available} onCheckedChange={(val) => setForm({ ...form, available: val })} />
          <span>{form.available ? 'Available' : 'Not Available'}</span>
        </div>
        <Button onClick={handleAddGig} disabled={submitting}>
          {submitting ? "Adding..." : "Add Gig"}
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="text-center text-gray-500">No gigs found.</p>
        ) : (
          gigs.filter(Boolean).map((gig, idx) => (
            <div key={idx} className="p-4 border rounded-xl shadow-sm relative">
              <button className="absolute top-2 right-2 text-red-500" onClick={() => handleRemoveGig(idx)}>
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold">{gig.title}</h3>
              <p className="text-sm text-gray-700 mb-1">{gig.description}</p>
              <p className="text-sm">💰 ₹{gig.rate}</p>
              <p className="text-sm">🟢 {gig.available ? 'Available' : 'Not Available'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(gig.tags) && gig.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Freelancing;
