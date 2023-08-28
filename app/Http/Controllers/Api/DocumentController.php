<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Document\DocumentRequest;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Config;



class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $documents = Document::all();
        foreach( $documents as $document){
            $document['file_path'] = Config::get('app.url').':8000'.$document['file_path'];
        }
        // dd($documents);
        return response()->json([
            'message'=>'all_docs',
            'data'=>$documents,
            'status'=>200
        ],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DocumentRequest $request)
    {
        $validate_data = $request->validated();
        // Store the PDF file in the 'public' disk
        $pdfPath = $request->file('pdf')->store('pdfs', 'public');

        // Generate the URL
        $pdfUrl = Storage::url($pdfPath);

        // Save the file path and URL along with other data to the database
        $result = Document::create([
            'title' => $validate_data['title'],
            'description' => $validate_data['description'],
            'file_path' => $pdfUrl, // Save the generated URL
        ]);

        if($result){
            return response()->json([
                'message'=>'document uploaded',
                'status' => 201,
            ],201);
        }else{
            return response()->json([
                'message'=>'something went wrong'
            ],500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
