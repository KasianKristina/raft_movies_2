/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MovieView` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Suggestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SuggestionMovie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."MovieView" DROP CONSTRAINT "MovieView_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SuggestionMovie" DROP CONSTRAINT "SuggestionMovie_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SuggestionMovie" DROP CONSTRAINT "SuggestionMovie_suggestion_id_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Movie_id_seq";

-- AlterTable
ALTER TABLE "MovieView" DROP CONSTRAINT "MovieView_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "movie_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MovieView_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MovieView_id_seq";

-- AlterTable
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Suggestion_id_seq";

-- AlterTable
ALTER TABLE "SuggestionMovie" DROP CONSTRAINT "SuggestionMovie_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "suggestion_id" SET DATA TYPE TEXT,
ALTER COLUMN "movie_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SuggestionMovie_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SuggestionMovie_id_seq";

-- AddForeignKey
ALTER TABLE "MovieView" ADD CONSTRAINT "MovieView_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestionMovie" ADD CONSTRAINT "SuggestionMovie_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "Suggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestionMovie" ADD CONSTRAINT "SuggestionMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
