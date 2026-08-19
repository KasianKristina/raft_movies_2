-- DropForeignKey
ALTER TABLE "public"."SuggestionMovie" DROP CONSTRAINT "SuggestionMovie_suggestion_id_fkey";

-- AddForeignKey
ALTER TABLE "SuggestionMovie" ADD CONSTRAINT "SuggestionMovie_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "Suggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
