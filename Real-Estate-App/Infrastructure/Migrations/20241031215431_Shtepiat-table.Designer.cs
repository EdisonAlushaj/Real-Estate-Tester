﻿// <auto-generated />
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace WebUI.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20241031215431_Shtepiat-table")]
    partial class Shtepiattable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Domain.Entities.Apartment", b =>
                {
                    b.Property<int>("ApartmentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ApartmentID"));

                    b.Property<string>("Adresa")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Emri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("floor")
                        .HasColumnType("int");

                    b.Property<bool>("kaAnshensor")
                        .HasColumnType("bit");

                    b.Property<int>("nrDhomave")
                        .HasColumnType("int");

                    b.HasKey("ApartmentID");

                    b.ToTable("Apartments");
                });

            modelBuilder.Entity("Domain.Entities.Shtepia", b =>
                {
                    b.Property<int>("ShtepiaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ShtepiaID"));

                    b.Property<string>("Adresa")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Emri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("kaGarazhd")
                        .HasColumnType("bit");

                    b.Property<bool>("kaPool")
                        .HasColumnType("bit");

                    b.Property<int>("nrFloors")
                        .HasColumnType("int");

                    b.Property<double>("size")
                        .HasColumnType("float");

                    b.HasKey("ShtepiaID");

                    b.ToTable("Shtepiat");
                });
#pragma warning restore 612, 618
        }
    }
}
