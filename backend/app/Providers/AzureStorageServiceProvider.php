<?php

namespace App\Providers;

use AzureOss\Storage\Blob\BlobServiceClient;
use AzureOss\Storage\Blob\Flysystem\AzureBlobStorageAdapter;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;

class AzureStorageServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Storage::extend('azure', function ($app, $config) {
            $connectionString = sprintf(
                'DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s;EndpointSuffix=core.windows.net',
                $config['account_name'],
                $config['account_key']
            );

            $client = new BlobServiceClient($connectionString);
            $adapter = new AzureBlobStorageAdapter($client, $config['container']);

            return new FilesystemAdapter(
                new Filesystem($adapter, $config),
                $adapter,
                $config
            );
        });
    }
}
