import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Star } from "lucide-react";

export function ReviewsTab({ reviews, onUpdate }: { reviews: any[], onUpdate: (id: string, updates: any) => void }) {
  const googleReviews = reviews.filter(r => r.source === 'google');
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  const featuredCount = reviews.filter(r => r.isFeatured).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <div className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Reviews</p>
            <p className="text-2xl font-bold">{reviews.length}</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <div className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Avg Rating</p>
            <p className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
              {avgRating} <Star className="w-5 h-5 fill-yellow-500" />
            </p>
          </div>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <div className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Google Reviews</p>
            <p className="text-2xl font-bold">{googleReviews.length}</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <div className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Featured on Site</p>
            <p className="text-2xl font-bold text-primary">{featuredCount}</p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Synced Google & Website Reviews</h3>
          <Button variant="outline" size="sm" onClick={() => alert("Syncing latest Google Reviews...")}>Sync Latest</Button>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No reviews found.</p>
            ) : (
              reviews.map((review, i) => (
                <div key={review._id || i} className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <p className="text-sm font-bold">{review.patientName}</p>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tracking-widest">{review.source}</span>
                    </div>
                    <span className="flex text-yellow-500 mb-1">
                      {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-500" />)}
                    </span>
                    <p className="text-xs text-slate-600">"{review.comment}"</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input 
                        type="checkbox" 
                        checked={review.isFeatured} 
                        onChange={(e) => onUpdate(review._id, { isFeatured: e.target.checked })} 
                        className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                      />
                      Show on Website
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
