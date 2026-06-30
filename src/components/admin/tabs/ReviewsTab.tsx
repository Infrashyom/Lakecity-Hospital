import { Button } from "@/src/components/ui/Button";
import { Edit, Star, Trash2 } from "lucide-react";

export function ReviewsTab({ reviews, fetchReviews, onEdit, onDelete }: { reviews: any[], fetchReviews: () => void, onEdit: (review: any) => void, onDelete: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-slate-500 text-center py-6 bg-white rounded-xl shadow-sm border border-slate-100">No reviews found.</p>
      ) : (
        reviews.map((review, i) => (
          <div key={review._id || review.id || i} className="bg-white border border-slate-200 p-6 rounded-xl flex justify-between items-start gap-4">
            <div className="space-y-3 flex-1 pr-6">
              <span className="flex text-yellow-500">
                {[...Array(review.rating || 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-500" />)}
              </span>
              <p className="text-sm text-slate-700 italic">"{review.comment}"</p>
              <p className="text-sm font-bold text-slate-900">- {review.patientName}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg" onClick={() => onEdit(review)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg" onClick={() => onDelete(review._id || review.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
